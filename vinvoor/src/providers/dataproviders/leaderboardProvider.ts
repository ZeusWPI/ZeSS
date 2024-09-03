import {
  convertLeaderboardItemJSON,
  LeaderboardItem,
  LeaderboardItemJSON,
} from "../../types/leaderboard";
import { createDataContext } from "../DataProvider";

export const {
  DataProvider: LeaderboardProvider,
  useDataContext: useLeaderboardContext,
} = createDataContext<readonly LeaderboardItem[], LeaderboardItemJSON[]>(
  "leaderboard",
  [],
  convertLeaderboardItemJSON,
);
