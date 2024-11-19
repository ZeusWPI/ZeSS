import type { Dayjs } from "dayjs";
import type { Season, SeasonJSON } from "../../types/seasons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertSeasonJSON } from "../../types/seasons";
import { deleteAPI, getApi, postApi } from "../../util/fetch";

const ENDPOINT = "admin/seasons";

export function useAdminSeasons() {
  return useQuery<Season[]>({
    queryKey: ["adminSeasons"],
    queryFn: async () => getApi<Season[], SeasonJSON[]>(ENDPOINT, convertSeasonJSON),
    retry: 1,
  });
}

export function useAdminAddSeason() {
  return useMutation({
    mutationFn: async (args: { name: string; startDate: Dayjs; endDate: Dayjs }) =>
      postApi(ENDPOINT, {
        name: args.name,
        start: args.startDate.format("YYYY-MM-DD"),
        end: args.endDate.format("YYYY-MM-DD"),
      }),
  });
}

export function useAdminDeleteSeason() {
  return useMutation({
    mutationFn: async (id: number) => deleteAPI(`${ENDPOINT}/${id}`),
  });
}
