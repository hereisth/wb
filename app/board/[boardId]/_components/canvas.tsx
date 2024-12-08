"use client";

import { useState } from "react";
import {
  useCanRedo,
  useHistory,
  useCanUndo
} from "@liveblocks/react/suspense";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { CanvasMode } from "@/types/canvas";

import type { CanvasState } from "@/types/canvas";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">

      {/* palce this div in the middle of the screen */}
      <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2">
        this is the canvas: {boardId}
      </div>
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
    </main>
  );
};
