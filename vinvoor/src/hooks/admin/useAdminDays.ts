import { useMutation, useQuery } from "@tanstack/react-query";
import { convertDayJSON, Day, DayJSON } from "../../types/days";
import { deleteAPI, getApi, postApi } from "../../util/fetch";
import { Dayjs } from "dayjs";

const ENDPOINT = "admin/days";

export const useAdminDays = () =>
  useQuery({
    queryKey: ["adminDays"],
    queryFn: () => getApi<Day[], DayJSON[]>(ENDPOINT, convertDayJSON),
    retry: 1,
  });

export const useAdminAddDay = () =>
  useMutation({
    mutationFn: (args: { startDate: Dayjs; endDate: Dayjs }) =>
      postApi(ENDPOINT, {
        start_date: args.startDate.format("YYYY-MM-DD"),
        end_date: args.endDate.format("YYYY-MM-DD"),
      }),
  });

export const useAdminDeleteDay = () =>
  useMutation({
    mutationFn: (id: number) => deleteAPI(`${ENDPOINT}/${id}`),
  });
