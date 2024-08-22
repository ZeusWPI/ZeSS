import { Card } from "./cards";
import { TableHeadCell } from "./general";

export interface ScanJSON {
  scanTime: string;
  cardSerial: string;
}

export interface Scan {
  scanTime: Date;
  cardSerial: string;
}

export interface ScanCard {
  scanTime: Date;
  card?: Card;
}

export const convertScanJSON = (scansJSON: ScanJSON[]): Scan[] =>
  scansJSON
    .map(scanJSON => ({
      scanTime: new Date(scanJSON.scanTime),
      cardSerial: scanJSON.cardSerial,
    }))
    .sort((a, b) => a.scanTime.getTime() - b.scanTime.getTime());

export const mergeScansCards = (
  scans: readonly Scan[],
  cards: readonly Card[],
): ScanCard[] =>
  scans.map(scan => ({
    scanTime: scan.scanTime,
    card: cards.find(card => card.serial === scan.cardSerial),
  }));

export const scanCardHeadCells: readonly TableHeadCell<ScanCard>[] = [
  {
    id: "scanTime",
    label: "Scan time",
    align: "left",
    padding: "normal",
    convert: (value: Date) => dateTimeFormat.format(value),
  } as TableHeadCell<ScanCard>,
  {
    id: "card",
    label: "Card",
    align: "right",
    padding: "normal",
    convert: (value?: Card) => value?.name ?? (value?.serial ?? "Unknown"),
  } as TableHeadCell<ScanCard>,
];

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  year: "2-digit",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});
