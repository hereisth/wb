"use client";

import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyBoards } from "./empty-boards";

interface BoardListPorps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListPorps) => {
  const data = [];

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

  return <div>{JSON.stringify(query)}</div>;
};
