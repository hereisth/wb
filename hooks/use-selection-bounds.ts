import { Layer, XYWH } from "@/types/canvas";
import { shallow, useSelf, useStorage } from "@liveblocks/react";

const boundingBox = (layers: Layer[]): XYWH | null => {
  const first = layers[0];
  if (!first) return null;

  let left = first.x;
  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;

  for (const layer of layers) {
    const { x, y, width, height } = layer;

    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x + width);
    bottom = Math.max(bottom, y + height);
  }

  return { x: left, y: top, width: right - left, height: bottom - top };
};

export const useSelectionBounds = () => {
  const selection = useSelf((me) => me.presence.selection);

  if (!selection) return null;

  return useStorage((root) => {
    const selectedLayers = selection
      .map((layerId) => root.layers.get(layerId))
      .filter((layer) => layer !== undefined);

    return boundingBox(selectedLayers);

  }, shallow);
};

