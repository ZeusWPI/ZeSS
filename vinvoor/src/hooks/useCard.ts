import type { Card, CardJSON } from "../types/cards";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertCardJSON } from "../types/cards";
import { getApi, patchApi } from "../util/fetch";

const ENDPOINT = "cards";

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => getApi<Card[], CardJSON[]>(ENDPOINT, convertCardJSON),
    retry: 1,
  });
}

export function usePatchCards() {
  return useMutation({
    mutationFn: async (args: { id: number; newName: string }) =>
      patchApi(`${ENDPOINT}/${args.id}`, {
        name: args.newName,
      }),
  });
}
