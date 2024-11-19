import type { Scan, ScanJSON } from "../types/scans";
import { useQuery } from "@tanstack/react-query";
import { convertScanJSON } from "../types/scans";
import { getApi } from "../util/fetch";

const ENDPOINT = "scans";

export function useScans() {
  return useQuery({
    queryKey: ["scans"],
    queryFn: async () => getApi<Scan[], ScanJSON[]>(ENDPOINT, convertScanJSON),
    retry: 1,
  });
}
