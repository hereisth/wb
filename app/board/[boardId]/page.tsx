"use client";

import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import CanvasLoading from "./_components/canvas-loading";

type SearchParams = {
  boardId: string;
};

interface BoardIdPageProps {
  params: SearchParams;
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  const { boardId } = params;

  return (
    <Room roomId={boardId} fallback={<CanvasLoading />}>
      <Canvas boardId={boardId} />
    </Room>
  );
};

export default BoardIdPage;
