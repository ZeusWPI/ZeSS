import { FC } from "react";
import { HeatmapRectStyle } from "../../theme";
import { RECT_RADIUS, RECT_SIZE, RECT_STROKE, SPACE } from "./utils";

interface RectProps {
  idx: number;
  cidx: number;
  isSmallView: boolean;
  colors: HeatmapRectStyle;
  dataTooltipContent: string;
}

export const Rect: FC<RectProps> = ({
  idx,
  cidx,
  isSmallView,
  colors,
  dataTooltipContent,
}) => {
  return (
    <rect
      width={RECT_SIZE(isSmallView)}
      height={RECT_SIZE(isSmallView)}
      x={idx * (RECT_SIZE(isSmallView) + SPACE(isSmallView))}
      y={(RECT_SIZE(isSmallView) + SPACE(isSmallView)) * cidx}
      rx={RECT_RADIUS(isSmallView)}
      {...colors}
      style={{
        strokeWidth: RECT_STROKE(isSmallView),
      }}
      className="rect"
      data-tooltip-id="heatmap"
      data-tooltip-content={dataTooltipContent}
    />
  );
};
