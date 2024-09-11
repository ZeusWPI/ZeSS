import { useQuery } from "@tanstack/react-query";
import { getApi } from "../util/fetch";
import { convertSeasonJSON, Season, SeasonJSON } from "../types/seasons";

const ENDPOINT = "seasons";

export const useSeasons = () => {
  return useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: () => getApi<Season[], SeasonJSON[]>(ENDPOINT, convertSeasonJSON),
    retry: 1,
  });
};
