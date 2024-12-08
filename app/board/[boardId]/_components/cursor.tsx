"use client";

import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";

import { connectionIdToColor } from "@/lib/utils";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);
  const name = info?.name || "Teamate";

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;

  return (
    // TODO: there is a bug about foreignObject in webkit
    // https://github.com/bkrem/react-d3-tree/issues/284
    // https://bugs.webkit.org/show_bug.cgi?id=23113
    <foreignObject
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      height={50}
      // TODO: name display is not good with non-english characters
      width={name.length * 20 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="w-5 h-5"
        style={{
          fill: connectionIdToColor(connectionId),
          color: connectionIdToColor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{
          backgroundColor: connectionIdToColor(connectionId),
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";