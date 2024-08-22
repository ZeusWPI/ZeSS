import { convertScanJSON, Scan, ScanJSON } from "../../types/scans";
import { createDataContext } from "../DataProvider";

export const { DataProvider: ScansProvider, useDataContext: useScansContext } =
  createDataContext<readonly Scan[], ScanJSON[]>("scans", [], convertScanJSON);
