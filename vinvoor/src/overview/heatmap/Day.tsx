import { useTheme } from "@mui/material";
import { FC, useMemo } from "react";
import "./heatmap.css";
import { Rect } from "./Rect";
import { DayData, HeatmapVariant } from "./types";
import {
  DATE_FORMATTER,
  DAYS_IN_WEEK,
  formatData,
  getColumnCountMonths,
  getMondayIndexedDay,
  isDayVariant,
  MILLISECONDS_IN_DAY,
  styleMonth,
  WEEKS_IN_MONTH,
} from "./utils";
import { useScans } from "../../hooks/useScan";

interface DayProps {
  startDate: Date;
  endDate: Date;
  columnCount: number;
  transform: string;
  isSmallView: boolean;
  variant: HeatmapVariant;
}

export const Day: FC<DayProps> = ({
  startDate,
  endDate,
  columnCount,
  transform,
  isSmallView,
  variant,
}) => {
  const theme = useTheme();
  const { data: scans } = useScans();
  if (!scans) return null; // Can never happen

  const data = useMemo<DayData>(() => {
    const normalizedScans = [...scans];
    // normalizedScans.forEach(scan => scan.scanTime.setHours(0, 0, 0, 0));
    const formattedScans = formatData(normalizedScans);

    const start = new Date(
      startDate.getTime() -
        startDate.getDay() * MILLISECONDS_IN_DAY +
        MILLISECONDS_IN_DAY,
    );

    const startDates = Array.from(
      {
        length: getColumnCountMonths(startDate, endDate),
      },
      (_, idx) => {
        const newStartDate = new Date(startDate);
        if (idx === 0) {
          while (newStartDate.getDay() !== 1) {
            newStartDate.setDate(newStartDate.getDate() - 1);
          }
        } else {
          newStartDate.setMonth(newStartDate.getMonth() + idx);
          newStartDate.setDate(1);
          while (newStartDate.getDay() !== 1) {
            newStartDate.setDate(newStartDate.getDate() + 1);
          }
        }

        return newStartDate;
      },
    );

    const endWeek = new Date(
      endDate.getTime() +
        MILLISECONDS_IN_DAY *
          (DAYS_IN_WEEK - (getMondayIndexedDay(endDate) % DAYS_IN_WEEK)),
    );

    return {
      data: formattedScans,
      start,
      endWeek,
      startDates,
    };
  }, [scans, startDate, endDate]);

  return (
    <g transform={transform}>
      {Array.from({ length: columnCount }, (_, idx) => {
        return (
          <g key={idx}>
            {isDayVariant(variant)
              ? Array.from({ length: DAYS_IN_WEEK }, (_, cidx) => {
                  const currentDate = new Date(
                    data.start.getTime() +
                      MILLISECONDS_IN_DAY * (idx * DAYS_IN_WEEK + cidx),
                  );

                  if (currentDate.getTime() < startDate.getTime()) return null;

                  if (currentDate.getTime() > endDate.getTime()) return null;

                  let colors = theme.heatmap.colorInActive;
                  if (data.data[currentDate.getTime()])
                    colors = theme.heatmap.colorActive;

                  const dataTooltipContent = `${
                    data.data[currentDate.getTime()] ? "Present" : "Absent"
                  } on ${DATE_FORMATTER.format(currentDate)}`;

                  return (
                    <Rect
                      key={cidx}
                      idx={idx}
                      cidx={cidx}
                      isSmallView={isSmallView}
                      colors={colors}
                      dataTooltipContent={dataTooltipContent}
                    />
                  );
                })
              : Array.from({ length: WEEKS_IN_MONTH }, (_, cidx) => {
                  const currentDate = new Date(
                    data.startDates[idx].getTime() +
                      MILLISECONDS_IN_DAY * cidx * DAYS_IN_WEEK,
                  );

                  // Week is no longer in the month
                  if (
                    currentDate.getMonth() > startDate.getMonth() + idx &&
                    getMondayIndexedDay(currentDate) <=
                      currentDate.getDate() - 1
                  )
                    return null;

                  // Week is after end date
                  if (currentDate.getTime() >= data.endWeek.getTime())
                    return null;

                  const count = Array.from(
                    { length: DAYS_IN_WEEK },
                    (_, i) =>
                      new Date(currentDate.getTime() + i * MILLISECONDS_IN_DAY),
                  ).filter(
                    date =>
                      date.getTime() <= endDate.getTime() &&
                      data.data[date.getTime()],
                  ).length;

                  const colors = styleMonth[Math.min(count, 5)](theme); // Can be higher than 5 if multiple scans in a day or scanned during the weekend

                  const dataTooltipContent = `${count} scan${
                    count !== 1 ? "s" : ""
                  } in the week of ${DATE_FORMATTER.format(currentDate)}`;

                  return (
                    <Rect
                      key={cidx}
                      idx={idx}
                      cidx={cidx}
                      isSmallView={isSmallView}
                      colors={colors}
                      dataTooltipContent={dataTooltipContent}
                    />
                  );
                })}
          </g>
        );
      })}
    </g>
  );
};
