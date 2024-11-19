import type {
  LeaderboardItem,
  LeaderboardItemJSON,
} from "../types/leaderboard";
import { useQuery } from "@tanstack/react-query";
import {
  convertLeaderboardItemJSON,
} from "../types/leaderboard";
import { getApi } from "../util/fetch";

const ENDPOINT = "leaderboard";

export function useLeaderboardItems() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () =>
      getApi<LeaderboardItem[], LeaderboardItemJSON[]>(
        ENDPOINT,
        convertLeaderboardItemJSON,
      ),
    retry: 1,
  });
}
