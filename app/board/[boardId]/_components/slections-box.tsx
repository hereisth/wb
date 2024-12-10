" use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import { memo } from "react";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: SelectionBoxProps) => {

  const soleLayerId = useSelf((me) => {
    return me.presence.selection.length === 1 ? me.presence.selection[0] : null;
  });

  const isShowingHandles = useStorage((root) => {
    return soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path;
  });

  const bounds = useSelectionBounds();

  if (!bounds) return null;

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        }}
        width={bounds.width}
        height={bounds.height}
        x={0}
        y={0}
      />
      {isShowingHandles && (
        <>
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />


          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />


          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />



          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              // TODO: Implement resize
            }}
          />


        </>



      )}
    </>
  );
});

SelectionBox.displayName = "SelectionBox";
