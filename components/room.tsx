"use client";

import { ReactNode } from "react";
import { LiveMap, LiveObject, LiveList } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Layer } from "@/types/canvas";

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
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: []
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}