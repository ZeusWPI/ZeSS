import { useQuery } from "@tanstack/react-query";
import { getApi } from "../util/fetch";
import { convertScanJSON, Scan, ScanJSON } from "../types/scans";

const ENDPOINT = "scans";

export const useScans = () =>
  useQuery({
    queryKey: ["scans"],
    queryFn: () => getApi<Scan[], ScanJSON[]>(ENDPOINT, convertScanJSON),
    retry: 1,
  });
