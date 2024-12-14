import { cn, colorToCss } from "@/lib/utils";
import { TextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const MAX_FONT_SIZE = 100;

const font = Kalam({
  subsets: ["latin"],
  weight: "400",
});

const calculateFontSize = (width: number, height: number) => {
  const sacleFactor = 0.5;
  const fontSizeBasedOnHeight = height * sacleFactor;
  const fontSizeBasedOnWidth = width * sacleFactor;
  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, MAX_FONT_SIZE);
};


interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor
}: TextProps) => {

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
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none"
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          color: fill ? colorToCss(fill) : "#000",
          fontSize: calculateFontSize(width, height),
        }}
      />
    </foreignObject>
  );
};