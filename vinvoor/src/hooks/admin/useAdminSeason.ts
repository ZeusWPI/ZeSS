import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteAPI, getApi, postApi } from "../../util/fetch";
import { Dayjs } from "dayjs";
import { convertSeasonJSON, Season, SeasonJSON } from "../../types/seasons";

const ENDPOINT = "admin/seasons";

export const useAdminSeasons = () => {
  return useQuery<Season[]>({
    queryKey: ["adminSeasons"],
    queryFn: () => getApi<Season[], SeasonJSON[]>(ENDPOINT, convertSeasonJSON),
    retry: 1,
  });
};

export const useAdminAddSeason = () =>
  useMutation({
    mutationFn: (args: { name: string; startDate: Dayjs; endDate: Dayjs }) =>
      postApi(ENDPOINT, {
        name: args.name,
        start: args.startDate.format("YYYY-MM-DD"),
        end: args.endDate.format("YYYY-MM-DD"),
      }),
  });

export const useAdminDeleteSeason = () =>
  useMutation({
    mutationFn: (id: number) => deleteAPI(`${ENDPOINT}/${id}`),
  });
