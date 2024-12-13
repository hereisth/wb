"use client";

import { memo } from "react";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2Icon } from "lucide-react";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface SelectionToolProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTool = memo(({
  camera,
  setLastUsedColor
}: SelectionToolProps) => {

  const selection = useSelf(me => me.presence.selection);
  const selectionBounds = useSelectionBounds();
  const deleteLayers = useDeleteLayers();

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get("layers");
      setLastUsedColor(fill);

      selection?.forEach(id => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selection, setLastUsedColor]
  );

  const sendToBack = useMutation((
    { storage }
  ) => {
    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];
    const arr = liveLayerIds.toArray();

    if (!selection) return;

    // get indices of selection
    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) {
        indices.push(i);
      }
    }

    // move selection to back
    for (let i = 0; i < indices.length; i++) {
      liveLayerIds.move(indices[i], i);
    }

  },
    [selection]
  );

  const moveToFront = useMutation((
    { storage }
  ) => {
    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];
    const arr = liveLayerIds.toArray();

    if (!selection) return;

    // get indices of selection
    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) {
        indices.push(i);
      }
    }

    // move selection to front
    for (let i = indices.length - 1; i >= 0; i--) {
      liveLayerIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
    }

  },
    [selection]
  );

  if (!selectionBounds) return null;

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate( calc(${x}px - 50%), calc(${y - 16}px - 100%))`
      }}
    >
      <ColorPicker
        onChange={setFill}
      />

      <div className="flex flex-col gap-y-0.5">
        <Hint label="bring to front">
          <Button
            variant="board"
            size="icon"
            onClick={moveToFront}
          >
            <BringToFront className="w-4 h-4" />
          </Button>
        </Hint>

        <Hint label="send to back">
          <Button
            variant="board"
            size="icon"
            onClick={sendToBack}
          >
            <SendToBack className="w-4 h-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Hint label="Delete">
          <Button
            variant="board"
            size="icon"
            onClick={deleteLayers}
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </Hint>

      </div>
    </div>
  );
});

SelectionTool.displayName = "SelectionTool";
