export type TableOrder = "asc" | "desc";

type TableAlignOptions = "right" | "left" | "center";

export interface TableHeadCell<T> {
    id: keyof T;
    label: string;
    align: TableAlignOptions;
    disablePadding: boolean;
}
