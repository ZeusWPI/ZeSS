import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardJSON, convertCardJSON } from "../types/cards";
import { getApi, patchApi } from "../util/fetch";

const ENDPOINT = "cards";

export const useCards = () =>
  useQuery<Card[]>({
    queryKey: ["cards"],
    queryFn: () => getApi<Card[], CardJSON[]>(ENDPOINT, convertCardJSON),
    retry: 1,
  });

export const usePatchCards = () => {
  return useMutation({
    mutationFn: (args: { id: number; newName: string }) =>
      patchApi(`${ENDPOINT}/${args.id}`, {
        name: args.newName,
      }),
  });
};
