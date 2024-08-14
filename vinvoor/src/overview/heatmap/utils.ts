import { Theme } from "@mui/material";
import { Scan } from "../../types/scans";
import { HeatmapValue, HeatmapVariant } from "./types";

export const getColumnCountDays = (startDate: Date, endDate: Date) => {
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(endDate);
  if (endOfWeek.getDay() === 0)
    endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay());
  else endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 6);

  return Math.ceil(
    (endOfWeek.getTime() - startOfWeek.getTime()) /
      (DAYS_IN_WEEK * MILLISECONDS_IN_DAY),
  );
};

export const getColumnCountMonths = (startDate: Date, endDate: Date) => {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth() +
    1
  );
};

export const getMondayIndexedDay = (date: Date) => (date.getDay() + 6) % 7;

export const formatData = (scans: Scan[]) => {
  const result: Record<number, HeatmapValue> = {};
  scans.forEach(scan => {
    result[scan.scanTime.getTime()] = {
      date: scan.scanTime,
      count: 1,
    };
  });

  return result;
};

export const isDayVariant = (variant: HeatmapVariant) =>
  variant === HeatmapVariant.DAYS;

export const styleMonth = [
  (theme: Theme) => theme.heatmap.color0,
  (theme: Theme) => theme.heatmap.color1,
  (theme: Theme) => theme.heatmap.color2,
  (theme: Theme) => theme.heatmap.color3,
  (theme: Theme) => theme.heatmap.color4,
  (theme: Theme) => theme.heatmap.color5,
];

// Constants

// Size

export const RECT_SIZE = (isSmallView: boolean) => (isSmallView ? 3 : 20);
export const RECT_RADIUS = (isSmallView: boolean) => (isSmallView ? 0.5 : 4);
export const RECT_STROKE = (isSmallView: boolean) => (isSmallView ? 0.3 : 2);
export const SPACE = (isSmallView: boolean) => (isSmallView ? 1.5 : 10);
export const TOP_PAD = (isSmallView: boolean) => (isSmallView ? 6 : 25);
export const LEFT_PAD = (isSmallView: boolean) => (isSmallView ? 2 : 5);
export const MONTH_RECT_Y = (isSmallView: boolean) => (isSmallView ? 4 : 15);
export const FONT_SIZE = (isSmallView: boolean) => (isSmallView ? 3 : 15);

// Month labels

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Formatter

export const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  year: "2-digit",
  month: "short",
  day: "numeric",
});

// Consts

export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_MONTH = 5;
export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
