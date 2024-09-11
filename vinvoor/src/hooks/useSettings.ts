import { useMutation, useQuery } from "@tanstack/react-query";
import { getApi, patchApi } from "../util/fetch";
import { converSettingsJSON, Settings, SettingsJSON } from "../types/settings";

const ENDPOINT = "settings";

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: () => getApi<Settings, SettingsJSON>(ENDPOINT, converSettingsJSON),
    retry: 1,
  });

export const usePatchSettings = () =>
  useMutation({
    mutationFn: (args: {
      scanInOut: boolean;
      leaderboard: boolean;
      public: boolean;
    }) =>
      patchApi(ENDPOINT, {
        scanInOut: args.scanInOut,
        leaderboard: args.leaderboard,
        public: args.public,
      }),
  });
