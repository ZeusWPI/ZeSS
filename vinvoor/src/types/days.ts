import { Base, BaseJSON, TableHeadCell } from "./general";

interface DayJSON extends BaseJSON {
  date: string;
}

export interface Day extends Base {
  date: Date;
}

export const convertDayJSON = (daysJSON: DayJSON[]): Day[] =>
  daysJSON
    .map(dayJSON => ({
      date: new Date(dayJSON.date),
      id: dayJSON.id,
      createdAt: new Date(dayJSON.createdAt),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

export const daysHeadCells: readonly TableHeadCell<Day>[] = [
  {
    id: "date",
    label: "Date",
    align: "left",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  },
];
