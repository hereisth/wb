"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  useCanRedo,
  useHistory,
  useCanUndo,
  useMutation,
  useStorage,
  useOthersMapped
} from "@liveblocks/react/suspense";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { CanvasMode } from "@/types/canvas";

import type { Camera, CanvasState, Color, Layer, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./slections-box";

interface CanvasProps {
  boardId: string;
}

const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds);

  // state
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  // TODO: get color from user
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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
    if(layer) {
      layer.update(bounds);
    }
  }, [canvasState]);

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

    if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    }

    setMyPresence({ cursor: current });
  }, [
    camera,
    canvasState,
    resizeSelectedLayer
  ]);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, [canvasState]);

  const onPointerUp = useMutation((
    { },
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({ mode: CanvasMode.None });
    }
    history.resume();
  }, [canvasState, camera, history, insertLayer]);

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
      <svg
        className="w-[100vw] h-[100vh]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
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
          <CursorPresence />
        </g>
      </svg>

    </main>
  );
};
