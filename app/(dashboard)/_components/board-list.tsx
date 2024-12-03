"use client";

import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyBoards } from "./empty-boards";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BoardCard } from "./board-card";

interface BoardListPorps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListPorps) => {
  const data = useQuery(api.boards.get, { orgId });

  // convex returns undefined if the query is not yet resolved
  // if data is not exist or empty, null will returned by convex
  if (data == undefined) {
    return (
      <div className="flex h-full items-center justify-center">Loading</div>
    );
  }

  // Search
  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  // Favorites
  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  // No boards
  if (!data?.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-6 pb-10">
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={false}
          />
        ))}
      </div>
    </div>
  );
};
