import type { Version, VersionJSON } from "../types/version";
import { useQuery } from "@tanstack/react-query";
import { convertVersionJSON } from "../types/version";
import { getApi } from "../util/fetch";

const ENDPOINT = "version";

export function useVersion() {
  return useQuery<Version>({
    queryKey: ["version"],
    queryFn: async () => getApi<Version, VersionJSON>(ENDPOINT, convertVersionJSON),
    retry: 1,
  });
}
