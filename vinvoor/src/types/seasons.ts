import { Base, BaseJSON } from "./general";

// External

export interface SeasonJSON extends BaseJSON {
  name: string;
  start: string;
  end: string;
}

// Internal

export interface Season extends Base {
  name: string;
  start: Date;
  end: Date;
}

// Converters

export const convertSeasonJSON = (seasonsJSON: SeasonJSON[]): Season[] =>
  seasonsJSON.map(seasonJSON => ({
    ...seasonJSON,
    start: new Date(seasonJSON.start),
    end: new Date(seasonJSON.end),
  }));
