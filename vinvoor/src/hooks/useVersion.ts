import { useQuery } from "@tanstack/react-query";
import { convertVersionJSON, Version, VersionJSON } from "../types/version";
import { getApi } from "../util/fetch";

const ENDPOINT = "version";

export const useVersion = () =>
  useQuery<Version>({
    queryKey: ["version"],
    queryFn: () => getApi<Version, VersionJSON>(ENDPOINT, convertVersionJSON),
    retry: 1,
  });
