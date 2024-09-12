import { Base, BaseJSON, TableHeadCell } from "./general";

// External

export interface SeasonJSON extends BaseJSON {
  name: string;
  start: string;
  end: string;
  is_current: boolean;
}

// Internal

export interface Season extends Base {
  name: string;
  start: Date;
  end: Date;
  isCurrent: boolean;
}

// Converters

export const convertSeasonJSON = (seasonsJSON: SeasonJSON[]): Season[] =>
  seasonsJSON.map(seasonJSON => ({
    ...seasonJSON,
    start: new Date(seasonJSON.start),
    end: new Date(seasonJSON.end),
    isCurrent: seasonJSON.is_current,
  }));

// Table

export const seasonsHeadCells: readonly TableHeadCell<Season>[] = [
  {
    id: "name",
    label: "Name",
    align: "left",
    padding: "normal",
  },
  {
    id: "start",
    label: "Start Date",
    align: "right",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  } as TableHeadCell<Season>,
  {
    id: "end",
    label: "End Date",
    align: "right",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  } as TableHeadCell<Season>,
];
