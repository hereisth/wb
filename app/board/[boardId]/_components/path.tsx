import { getSvgPathFromStroke } from "@/lib/utils";
import { PathLayer } from "@/types/canvas";
import getStroke from "perfect-freehand";

interface PathProps {
  x: number,
  y: number,
  points: number[][];
  fill: string,
  onPointerDown?: (e: React.PointerEvent) => void,
  stroke?: string;
}

export const Path = ({
  x,
  y,
  points,
  fill,
  onPointerDown,
  stroke
}: PathProps) => {

    return <path 
      className="drop-shadow-md"
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5
        })
      )}
      x={0}
      y={0}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
};
