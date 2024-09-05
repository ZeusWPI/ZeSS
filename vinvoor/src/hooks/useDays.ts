import { useMutation, useQuery } from "@tanstack/react-query";
import { convertDayJSON, Day, DayJSON } from "../types/days";
import { deleteAPI, getApi } from "../util/fetch";

const ENDPOINT = "admin/days";

export const useDays = () =>
  useQuery({
    queryKey: ["days"],
    queryFn: () => getApi<Day[], DayJSON[]>(ENDPOINT, convertDayJSON),
  });

export const useDeleteDay = () => {
  return useMutation({
    mutationFn: (id: number) => deleteAPI(`${ENDPOINT}/${id}`),
  });
};
