import { Kalam } from "next/font/google";
import { useMutation } from "@liveblocks/react/suspense";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { calculateFontSize, cn, colorToCss, getContrastingColor } from "@/lib/utils";
import { NoteLayer } from "@/types/canvas";

const font = Kalam({
  subsets: ["latin"],
  weight: "400",
});

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor
}: NoteProps) => {

  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation((
    {storage},
    newValue: string
  ) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      className="shadow-md drop-shadow-xl"
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center outline-none",
          font.className
        )}
        style={{
          color: getContrastingColor(fill),
          fontSize: calculateFontSize(width, height, layer.type),
        }}
      />
    </foreignObject>
  );
};
