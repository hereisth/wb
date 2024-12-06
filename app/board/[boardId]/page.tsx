"use client";
import { use } from "react";

import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import CanvasLoading from "./_components/canvas-loading";

type SearchParams = {
  boardId: string;
};

interface BoardIdPageProps {
  params: Promise<SearchParams>;
}

const BoardIdPage = (props: BoardIdPageProps) => {
  const params = use(props.params);
  const { boardId } = params;

  return (
    <Room roomId={boardId} fallback={<CanvasLoading />}>
      <Canvas boardId={boardId} />
    </Room>
  );
};

export default BoardIdPage;
