"use client";

import { memo } from "react";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
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

      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Hint label="Delete">
          <Button
            variant="ghost"
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
