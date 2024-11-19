import type { Base, BaseJSON, TableHeadCell } from "./general";

// External

export interface CardJSON extends BaseJSON {
  serial: string;
  name: string;
  last_used: string;
  amount_used: number;
  created_at: string;
}

export interface CardPostResponseJSON {
  is_current_user: boolean;
}

export interface CardGetRegisterResponseJSON {
  registering: boolean;
  is_current_user: boolean;
  success: boolean;
  time_remaining: number;
  time_percentage: number;
}

// Internal

export interface Card extends Base {
  serial: string;
  name: string;
  lastUsed: Date;
  amountUsed: number;
  createdAt: Date;
}

export interface CardPostResponse {
  isCurrentUser: boolean;
}

export interface CardGetRegisterResponse {
  registering: boolean;
  isCurrentUser: boolean;
  success: boolean;
  timeRemaining: number;
  timePercentage: number;
}

// Converters

export function convertCardJSON(cardsJSON: CardJSON[]): Card[] {
  return cardsJSON.map(cardJSON => ({
    ...cardJSON,
    lastUsed: new Date(cardJSON.last_used),
    amountUsed: cardJSON.amount_used,
    createdAt: new Date(cardJSON.created_at),
  }));
}

export function convertCardPostResponseJSON(cardJSON: CardPostResponseJSON): CardPostResponse {
  return {
    isCurrentUser: cardJSON.is_current_user,
  };
}

export function convertCardGetRegisterResponseJSON(cardJSON: CardGetRegisterResponseJSON): CardGetRegisterResponse {
  return {
    ...cardJSON,
    isCurrentUser: cardJSON.is_current_user,
    timeRemaining: cardJSON.time_remaining,
    timePercentage: cardJSON.time_percentage,
  };
}

// Table

export const cardsHeadCells: readonly TableHeadCell<Card>[] = [
  {
    id: "name",
    label: "Name",
    align: "left",
    padding: "none",
  },
  {
    id: "amountUsed",
    label: "Uses",
    align: "right",
    padding: "none",
  },
  {
    id: "lastUsed",
    label: "Last used",
    align: "right",
    padding: "normal",
    convert: (value: Date) => {
      if (value.getFullYear() === 1)
        return "Not used";
      else return value.toDateString();
    },
  } as TableHeadCell<Card>,
  {
    id: "createdAt",
    label: "Created at",
    align: "right",
    padding: "normal",
    convert: (value: Date) => value.toDateString(),
  } as TableHeadCell<Card>,
  {
    id: "serial",
    label: "Serial",
    align: "right",
    padding: "normal",
  },
];
