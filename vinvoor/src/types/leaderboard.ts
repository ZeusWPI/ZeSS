import { TableHeadCell } from "./general";

// External

export interface LeaderboardItemJSON {
  position: number;
  user_id: number;
  username: string;
  total_days: number;
  position_change: number;
}

// Internal

export interface LeaderboardItem {
  position: number;
  user_id: number;
  username: string;
  total_days: number;
  position_change: number;
}

// Converters

export const convertLeaderboardItemJSON = (
  leaderboardItems: LeaderboardItemJSON[],
): LeaderboardItem[] =>
  leaderboardItems.map(leaderboardItem => ({
    ...leaderboardItem,
    userId: leaderboardItem.user_id,
    totalDays: leaderboardItem.total_days,
    positionChange: leaderboardItem.position_change,
  }));

// Table

export const leaderboardHeadCells: readonly TableHeadCell<LeaderboardItem>[] = [
  {
    id: "position_change",
    label: "Change",
    align: "right",
    padding: "checkbox",
  },
  {
    id: "position",
    label: "#",
    align: "center",
    padding: "checkbox",
  },
  {
    id: "username",
    label: "Username",
    align: "left",
    padding: "normal",
  },
  {
    id: "total_days",
    label: "Total Days",
    align: "right",
    padding: "normal",
  },
];
