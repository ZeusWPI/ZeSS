export interface CardType {
    serial: string;
    created_at: string;
}

export type Order = "asc" | "desc";

interface HeadCell {
    id: keyof CardType;
    label: string;
    timestamp: boolean;
    disablePadding: boolean;
}

export const headCells: readonly HeadCell[] = [
    {
        id: "serial",
        label: "Serial",
        timestamp: false,
        disablePadding: true,
    },
    {
        id: "created_at",
        label: "Created at",
        timestamp: true,
        disablePadding: false,
    },
];
