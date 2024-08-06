import { Base, BaseJSON, TableHeadCell } from "./general";

interface CardJSON extends BaseJSON {
    serial: string;
    name: string;
    lastUsed: string;
    amountUsed: number;
}

export interface Card extends Base {
    serial: string;
    name: string;
    lastUsed: Date;
    amountUsed: number;
}

export const convertCardJSON = (cardsJSON: CardJSON[]): Card[] =>
    cardsJSON.map((CardJSON) => ({
        serial: CardJSON.serial,
        name: CardJSON.name,
        lastUsed: new Date(CardJSON.lastUsed),
        amountUsed: CardJSON.amountUsed,
        id: CardJSON.id,
        createdAt: new Date(CardJSON.createdAt),
    }));

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
            if (value.getFullYear() === 1) return "Not used";
            else return value.toDateString();
        },
    },
    {
        id: "createdAt",
        label: "Created at",
        align: "right",
        padding: "normal",
        convert: (value: Date) => value.toDateString(),
    },
    {
        id: "serial",
        label: "Serial",
        align: "right",
        padding: "normal",
    },
];

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
