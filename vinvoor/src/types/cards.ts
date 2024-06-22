import { TableHeadCell } from "./table";

export interface Card {
    serial: string;
    createdAt: string;
}

export const CardsHeadCells: readonly TableHeadCell<Card>[] = [
    {
        id: "serial",
        label: "Serial",
        align: "left",
        disablePadding: true,
    },
    {
        id: "createdAt",
        label: "Created at",
        align: "right",
        disablePadding: false,
    },
];
