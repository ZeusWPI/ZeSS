import { useQuery } from "@tanstack/react-query";
import { getApi } from "../util/fetch";
import {
  convertLeaderboardItemJSON,
  LeaderboardItem,
  LeaderboardItemJSON,
} from "../types/leaderboard";

const ENDPOINT = "leaderboard";

export const useLeaderboardItems = () =>
  useQuery({
    queryKey: ["leaderboard"],
    queryFn: () =>
      getApi<LeaderboardItem[], LeaderboardItemJSON[]>(
        ENDPOINT,
        convertLeaderboardItemJSON,
      ),
  });
