import { TableHeadCell } from "./table";

interface CardJSON {
    serial: string;
    createdAt: string;
}

export interface Card {
    serial: string;
    createdAt: Date;
}

export const convertCardJSON = (cardsJSON: CardJSON[]): Card[] =>
    cardsJSON.map((CardJSON) => ({
        serial: CardJSON.serial,
        createdAt: new Date(CardJSON.createdAt),
    }));

export const CardsHeadCells: readonly TableHeadCell<Card>[] = [
    {
        id: "serial",
        label: "Serial",
        align: "left",
        padding: "none",
    },
    {
        id: "createdAt",
        label: "Created at",
        align: "right",
        padding: "normal",
        convert: (value: Date) => value.toDateString(),
    },
];

export interface CardPostResponse {
    is_current_user: boolean;
}
