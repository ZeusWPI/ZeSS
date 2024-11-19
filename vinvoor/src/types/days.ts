import type { Base, BaseJSON, TableHeadCell } from "./general";

// External

export interface DayJSON extends BaseJSON {
  date: string;
}

// Internal

export interface Day extends Base {
  date: Date;
}

// Converters

export function convertDayJSON(daysJSON: DayJSON[]): Day[] {
  return daysJSON
    .map(dayJSON => ({
      ...dayJSON,
      date: new Date(dayJSON.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Table

export const daysHeadCells: readonly TableHeadCell<Day>[] = [
  {
    id: "date",
    label: "Date",
    align: "left",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  } as TableHeadCell<Day>,
];
