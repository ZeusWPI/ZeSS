export enum HeatmapVariant {
  DAYS,
  MONTHS,
}

export interface HeatmapValue {
  date: Date;
  count: number; // Could be used in the future for check in and out
}

export interface DayData {
  data: Record<number, HeatmapValue>; // Each scan
  start: Date; // Start brought back to the beginning of the week
  endWeek: Date; // First day of the week after the end date
  startDates: Record<number, Date>; // Start of each week for each month
}

export interface DayLabel {
  col: number;
  month: number;
  monthStr: string;
}

export interface MonthLabel {
  monthStr: string;
}

export interface LabelData {
  day: DayLabel[];
  month: MonthLabel[];
}
