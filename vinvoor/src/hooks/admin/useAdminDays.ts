import type { Dayjs } from "dayjs";
import type { Day, DayJSON } from "../../types/days";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertDayJSON } from "../../types/days";
import { deleteAPI, getApi, postApi } from "../../util/fetch";

const ENDPOINT = "admin/days";

export function useAdminDays() {
  return useQuery({
    queryKey: ["adminDays"],
    queryFn: async () => getApi<Day[], DayJSON[]>(ENDPOINT, convertDayJSON),
    retry: 1,
  });
}

export function useAdminAddDay() {
  return useMutation({
    mutationFn: async (args: { startDate: Dayjs; endDate: Dayjs }) =>
      postApi(ENDPOINT, {
        start_date: args.startDate.format("YYYY-MM-DD"),
        end_date: args.endDate.format("YYYY-MM-DD"),
      }),
  });
}

export function useAdminDeleteDay() {
  return useMutation({
    mutationFn: async (id: number) => deleteAPI(`${ENDPOINT}/${id}`),
  });
}
