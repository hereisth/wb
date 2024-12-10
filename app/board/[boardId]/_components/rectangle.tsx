import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor
}: RectangleProps) => {

  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="drop-shadow-md"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : "transparent"}
      stroke={selectionColor || "transparent"}
    />
  );

};
