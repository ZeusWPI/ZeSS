interface ScanJSON {
    scanTime: string;
    card: string;
}

export interface Scan {
    scanTime: Date;
    card: string;
}

export const convertScanJSON = (scansJSON: ScanJSON[]): Scan[] =>
    scansJSON
        .map((scanJSON) => ({
            scanTime: new Date(scanJSON.scanTime),
            card: scanJSON.card,
        }))
        .sort((a, b) => a.scanTime.getTime() - b.scanTime.getTime());
