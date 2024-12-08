"use client";

import { useCallback, useState } from "react";
import {
  useCanRedo,
  useHistory,
  useCanUndo,
  useMutation
} from "@liveblocks/react/suspense";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { CanvasMode } from "@/types/canvas";

import type { Camera, CanvasState } from "@/types/canvas";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY
    }));
  }, []);

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e, camera);
    setMyPresence({ cursor: current });
  }, []);

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

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
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`
          }}
        >
          <CursorPresence />
        </g>
      </svg>

    </main>
  );
};
