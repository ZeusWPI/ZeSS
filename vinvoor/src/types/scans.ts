import type { Card } from "./cards";
import type { Base, BaseJSON, TableHeadCell } from "./general";
import { dateTimeFormat } from "../util/util";

// External

export interface ScanJSON extends BaseJSON {
  scan_time: string;
  card_serial: string;
  created_at: string;
}

// Internal

export interface Scan extends Base {
  scanTime: Date;
  cardSerial: string;
  createdAt: Date;
}

export interface ScanCard {
  scanTime: Date;
  card?: Card;
}

// Converters

export function convertScanJSON(scansJSON: ScanJSON[]): Scan[] {
  return scansJSON
    .map(scanJSON => ({
      ...scanJSON,
      scanTime: new Date(scanJSON.scan_time),
      cardSerial: scanJSON.card_serial,
      createdAt: new Date(scanJSON.created_at),
    }))
    .sort((a, b) => a.scanTime.getTime() - b.scanTime.getTime());
}

// Table

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
    convert: (value?: Card) => value?.name ?? value?.serial ?? "Unknown",
  } as TableHeadCell<ScanCard>,
];

// Other

export function mergeScansCards(scans: readonly Scan[], cards: readonly Card[]): ScanCard[] {
  return scans.map(scan => ({
    scanTime: scan.scanTime,
    card: cards.find(card => card.serial === scan.cardSerial),
  }));
}
