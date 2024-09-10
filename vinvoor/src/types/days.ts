import { Base, BaseJSON, TableHeadCell } from "./general";

// External

export interface DayJSON extends BaseJSON {
  date: string;
}

// Internal

export interface Day extends Base {
  date: Date;
}

// Converters

export const convertDayJSON = (daysJSON: DayJSON[]): Day[] =>
  daysJSON
    .map(dayJSON => ({
      ...dayJSON,
      date: new Date(dayJSON.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

export const daysHeadCells: readonly TableHeadCell<Day>[] = [
  {
    id: "date",
    label: "Date",
    align: "left",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  } as TableHeadCell<Day>,
];
