export interface BaseJSON {
    id: number;
    createdAt: string;
}

export interface Base {
    id: number;
    createdAt: Date;
}

export type TableOrder = "asc" | "desc";

type TableAlignOptions = "right" | "left" | "center";
type TablePaddingOptions = "none" | "normal" | "checkbox";

export interface TableHeadCell<T> {
    id: keyof T;
    label: string;
    align: TableAlignOptions;
    padding: TablePaddingOptions;
    convert?: (value: any) => string;
}
