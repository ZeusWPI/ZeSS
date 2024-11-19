import type { Settings, SettingsJSON } from "../types/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { converSettingsJSON } from "../types/settings";
import { getApi, patchApi } from "../util/fetch";

const ENDPOINT = "settings";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => getApi<Settings, SettingsJSON>(ENDPOINT, converSettingsJSON),
    retry: 1,
  });
}

export function usePatchSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: Record<string, string | number | boolean>) =>
      patchApi(ENDPOINT, args),
    onSuccess: async () =>
      queryClient.invalidateQueries({
        predicate: query => query.queryKey[0] !== "settings",
      }),
  });
}
