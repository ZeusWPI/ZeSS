import { Card } from "./cards";
import { TableHeadCell } from "./general";

interface ScanJSON {
    scanTime: string;
    card: string;
}

export interface Scan {
    scanTime: Date;
    card: string;
}

export interface ScanCard {
    scanTime: Date;
    card?: Card;
}

export const convertScanJSON = (scansJSON: ScanJSON[]): Scan[] =>
    scansJSON
        .map((scanJSON) => ({
            scanTime: new Date(scanJSON.scanTime),
            card: scanJSON.card,
        }))
        .sort((a, b) => a.scanTime.getTime() - b.scanTime.getTime());

export const mergeScansCards = (
    scans: readonly Scan[],
    cards: readonly Card[]
): readonly ScanCard[] =>
    scans.map((scan) => ({
        scanTime: scan.scanTime,
        card: cards.find((card) => card.serial === scan.card),
    }));

export const scanCardHeadCells: readonly TableHeadCell<ScanCard>[] = [
    {
        id: "card",
        label: "Card",
        align: "left",
        padding: "normal",
        convert: (value: Card | undefined) =>
            value?.name ?? value?.serial ?? "Unknown",
    },
    {
        id: "scanTime",
        label: "Scan time",
        align: "right",
        padding: "normal",
        convert: (value: Date) => value.toDateString(),
    },
];
