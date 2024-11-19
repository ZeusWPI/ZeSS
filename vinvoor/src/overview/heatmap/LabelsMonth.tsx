import type { FC } from "react";
import type { DayLabel, HeatmapVariant, LabelData } from "./types";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import {
  DAYS_IN_WEEK,
  FONT_SIZE,
  getColumnCountDays,
  getColumnCountMonths,
  isDayVariant,
  LEFT_PAD,
  MILLISECONDS_IN_DAY,
  MONTH_LABELS,
  MONTH_RECT_Y,
  RECT_SIZE,
  SPACE,
} from "./utils";

interface LablesMonthProps {
  startDate: Date;
  endDate: Date;
  isSmallView: boolean;
  variant: HeatmapVariant;
}

export const LabelsMonth: FC<LablesMonthProps> = ({
  startDate,
  endDate,
  isSmallView,
  variant,
}) => {
  const theme = useTheme();

  const data = useMemo<LabelData>(() => {
    const day: DayLabel[] = Array.from(
      { length: getColumnCountDays(startDate, endDate) * DAYS_IN_WEEK },
      (_, idx) => {
        if ((idx / DAYS_IN_WEEK) % 1 === 0) {
          const date = new Date(
            startDate.getTime() + idx * MILLISECONDS_IN_DAY,
          );
          const month = date.getMonth();

          return {
            col: idx / 7,
            month,
            monthStr: MONTH_LABELS[month],
          };
        }
        return {} as DayLabel;
      },
    )
      .filter(item => Object.keys(item).length)
      .filter((item, idx, list) =>
        list[idx - 1] ? list[idx - 1].month !== item.month : true,
      );

    const month = Array.from(
      { length: getColumnCountMonths(startDate, endDate) },
      (_, idx) => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + idx);

        return { monthStr: MONTH_LABELS[date.getMonth()] };
      },
    ).filter((_, idx) => idx % 2 === 0);

    return {
      day,
      month,
    };
  }, [startDate, endDate]);

  return (
    <>
      {(isDayVariant(variant) ? data.day : data.month).map((item, idx) => {
        return (
          <text
            key={idx} // eslint-disable-line react/no-array-index-key
            x={2 * SPACE(isSmallView) + LEFT_PAD(isSmallView)}
            y={MONTH_RECT_Y(isSmallView)}
            dx={
              (isDayVariant(variant) ? (item as DayLabel).col : idx * 2)
              * (RECT_SIZE(isSmallView) + SPACE(isSmallView))
              - SPACE(isSmallView)
            }
            style={{
              textAnchor: "middle",
              fontSize: FONT_SIZE(isSmallView),
              fontFamily: "roboto",
              fill: theme.palette.primary.contrastText,
            }}
          >
            {item.monthStr}
          </text>
        );
      })}
    </>
  );
};
