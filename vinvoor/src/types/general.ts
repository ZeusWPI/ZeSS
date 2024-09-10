export type Optional<T> = T | undefined;

export interface BaseJSON {
  id: number;
}

export interface Base {
  id: number;
}

export type TableOrder = "asc" | "desc";

type TableAlignOptions = "right" | "left" | "center";
type TablePaddingOptions = "none" | "normal" | "checkbox";

export interface TableHeadCell<T> {
  id: keyof T;
  label: string;
  align: TableAlignOptions;
  padding: TablePaddingOptions;
  convert?: (value: T[keyof T]) => string;
}
