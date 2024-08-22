import { convertScanJSON, Scan } from "../../types/scans";
import { createDataContext } from "../DataProvider";

export const { DataProvider: ScansProvider, useDataContext: useScansContext } =
  createDataContext<readonly Scan[]>("scans", [], convertScanJSON);
