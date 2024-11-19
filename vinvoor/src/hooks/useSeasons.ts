import type { MutateOptions } from "@tanstack/react-query";
import type { Season, SeasonJSON } from "../types/seasons";
import { useQuery } from "@tanstack/react-query";
import { convertSeasonJSON } from "../types/seasons";
import { getApi } from "../util/fetch";
import { usePatchSettings } from "./useSettings";

const ENDPOINT = "seasons";

export function useSeasons() {
  return useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: async () => getApi<Season[], SeasonJSON[]>(ENDPOINT, convertSeasonJSON),
    retry: 1,
  });
}

export function useSetSeason() {
  const { mutate, ...other } = usePatchSettings();

  const setSeason = (
    id: number,
    options: MutateOptions<
      unknown,
      Error,
      Record<string, string | number | boolean>,
      unknown
    >,
  ) => mutate({ season: id }, options);

  return { setSeason, ...other };
}
