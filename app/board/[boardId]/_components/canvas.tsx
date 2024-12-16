"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  useCanRedo,
  useHistory,
  useCanUndo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf
} from "@liveblocks/react/suspense";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { CursorPresence } from "./cursor-presence";
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { CanvasMode } from "@/types/canvas";

import type { Camera, CanvasState, Color, Layer, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./slections-box";
import { SelectionTool } from "./selection-tools";
import { Path } from "./path";
import { useDisableScrollBounce } from "@/hooks/use-diableScrollBounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface CanvasProps {
  boardId: string;
}

const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;

export const Canvas = ({ boardId }: CanvasProps) => {

  // state
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  // hooks
  useDisableScrollBounce();
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf(me => me.presence.pencilDraft);
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Backspace":
          deleteLayers();
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteLayers, history]);

  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text | LayerType.Note,
    position: Point
  ) => {

    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      return;
    }

    const livelayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject<Layer>({
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor,
    });

    livelayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point
  ) => {

    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);
    if (layer) {
      layer.update(bounds);
    }
  }, [canvasState]);

  const translateSelectedLayer = useMutation((
    { storage, self },
    point: Point
  ) => {
    if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }
    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    };

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        });
      }
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });

  }, [canvasState]);

  const unselectLayers = useMutation((
    { self, setMyPresence }
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, [canvasState]);

  const updateMulipleSelection = useMutation((
    { storage, setMyPresence },
    current: Point,
    origin: Point
  ) => {
    const layers = storage.get("layers").toImmutable();
    setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    const selectedIds = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current
    );
    setMyPresence({ selection: selectedIds });

  }, [layerIds]);

  const startMulipleSelection = useCallback((
    current: Point,
    origin: Point
  ) => {
    if (
      Math.abs(current.x - origin.x) +
      Math.abs(current.y - origin.y) > SELECTION_NET_THRESHOLD
    ) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

  const startDrawing = useMutation((
    { setMyPresence },
    point: Point,
    pressure: number
  ) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor
    });
  }, [lastUsedColor]);

  const continueDrawing = useMutation((
    { setMyPresence, self },
    point: Point,
    e: React.PointerEvent
  ) => {
    const { pencilDraft } = self.presence;

    if (
      canvasState.mode !== CanvasMode.Pencil ||
      e.buttons !== 1 ||
      pencilDraft == null
    ) {
      return;
    }

    setMyPresence({
      cursor: point,
      pencilDraft:
        pencilDraft.length === 1 &&
          pencilDraft[0][0] == point.x &&
          pencilDraft[0][1] == point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]]
    });

  }, [canvasState.mode]);

  const insertPath = useMutation((
    { storage, self, setMyPresence }
  ) => {

    const liveLayers = storage.get("layers");
    const { pencilDraft, penColor } = self.presence;

    if (
      pencilDraft == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null, penColor: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(penPointToPathLayer(pencilDraft, lastUsedColor))
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, [lastUsedColor]);

  // handlers
  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH
  ) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner,
    });
  }, [history]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY
    }));
  }, []);

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMulipleSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateMulipleSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    }

    setMyPresence({ cursor: current });
  }, [
    camera,
    canvasState,
    resizeSelectedLayer,
    translateSelectedLayer,
    startMulipleSelection,
    updateMulipleSelection,
    continueDrawing
  ]);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, [canvasState]);

  const onPointerUp = useMutation((
    { },
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (
      canvasState.mode === CanvasMode.Pressing ||
      canvasState.mode === CanvasMode.None
    ) {
      unselectLayers();
      setCanvasState({ mode: CanvasMode.None });
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath();
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({ mode: CanvasMode.None });
    }
    history.resume();
  }, [
    canvasState,
    camera,
    history,
    insertLayer,
    unselectLayers,
    setCanvasState,
    insertPath
  ]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) return;

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure);
      return;
    }

    setCanvasState({ mode: CanvasMode.Pressing, origin: point });

  }, [canvasState.mode, camera, setCanvasState, startDrawing]);

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string
  ) => {
    if (
      canvasState.mode === CanvasMode.Pencil
      || canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
    setCanvasState({ mode: CanvasMode.Translating, current: point });

  }, [canvasState, camera, history, canvasState.mode]);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};
    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }
    return layerIdsToColorSelection;
  }, [selections]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">

      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <SelectionTool
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`
          }}
        >

          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorPresence />

          {
            pencilDraft &&
            pencilDraft.length > 0 &&
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              stroke={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          }

        </g>
      </svg>

    </main>
  );
};
