import { useMutation } from "@tanstack/react-query";
import { deleteAPI, postApi } from "../../util/fetch";
import { Dayjs } from "dayjs";

const ENDPOINT = "admin/seasons";

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
