import type { FC } from "react";
import type { HeatmapVariant } from "./types";
import { useMediaQuery, useTheme } from "@mui/material";
import { Day } from "./Day";
import { LabelsMonth } from "./LabelsMonth";
import {
  DAYS_IN_WEEK,
  getColumnCountDays,
  getColumnCountMonths,
  isDayVariant,
  LEFT_PAD,
  RECT_SIZE,
  SPACE,
  TOP_PAD,
  WEEKS_IN_MONTH,
} from "./utils";

interface HeatmapProps {
  startDate: Date;
  endDate: Date;
  variant: HeatmapVariant;
}

export const Heatmap: FC<HeatmapProps> = ({ startDate, endDate, variant }) => {
  const theme = useTheme();
  const isSmallView = useMediaQuery(theme.breakpoints.down("lg"));

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const columnCount = isDayVariant(variant)
    ? getColumnCountDays(startDate, endDate)
    : getColumnCountMonths(startDate, endDate);

  return (
    <svg
      viewBox={`0 0 ${
        columnCount * (RECT_SIZE(isSmallView) + SPACE(isSmallView))
        + LEFT_PAD(isSmallView)
      } ${
        (isDayVariant(variant) ? DAYS_IN_WEEK : WEEKS_IN_MONTH)
        * (RECT_SIZE(isSmallView) + SPACE(isSmallView))
        + TOP_PAD(isSmallView)
      }`}
    >
      <LabelsMonth
        startDate={startDate}
        endDate={endDate}
        isSmallView={isSmallView}
        variant={variant}
      />
      <Day
        startDate={startDate}
        endDate={endDate}
        columnCount={columnCount}
        transform={`translate(${LEFT_PAD(isSmallView)}, ${TOP_PAD(
          isSmallView,
        )})`}
        isSmallView={isSmallView}
        variant={variant}
      />
    </svg>
  );
};
