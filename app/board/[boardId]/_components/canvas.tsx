"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">

      {/* palce this div in the middle of the screen */}
      <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2">
        this is the canvas: {boardId}
      </div>
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};
