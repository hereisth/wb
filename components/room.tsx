"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

interface RoomProps {
  roomId: string;
  children: ReactNode;
  fallback: NonNullable<ReactNode> | null;
}

export function Room({ children, roomId, fallback }: RoomProps) {
  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      throttle={18}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}