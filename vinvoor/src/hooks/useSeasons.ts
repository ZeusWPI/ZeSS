import { MutateOptions, useQuery } from "@tanstack/react-query";
import { getApi } from "../util/fetch";
import { convertSeasonJSON, Season, SeasonJSON } from "../types/seasons";
import { usePatchSettings } from "./useSettings";

const ENDPOINT = "seasons";

export const useSeasons = () => {
  return useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: () => getApi<Season[], SeasonJSON[]>(ENDPOINT, convertSeasonJSON),
    retry: 1,
  });
};

export const useSetSeason = () => {
  const { mutate, ...rest } = usePatchSettings();

  const setSeason = (
    id: number,
    options: MutateOptions<
      unknown,
      Error,
      Record<string, string | number | boolean>,
      unknown
    >,
  ) => mutate({ season: id }, options);

  return { setSeason, ...rest };
};
