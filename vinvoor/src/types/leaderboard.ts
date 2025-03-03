import type { TableHeadCell } from "./general";

// External

export interface LeaderboardItemJSON {
  position: number;
  id: number;
  name: string;
  total_days: number;
  position_change: number;
  checked_in: boolean;
}

// Internal

export interface LeaderboardItem {
  position: number;
  id: number;
  name: string;
  totalDays: number;
  positionChange: number;
  checkedIn: boolean;
}

// Converters

export function convertLeaderboardItemJSON(leaderboardItems: LeaderboardItemJSON[]): LeaderboardItem[] {
  return leaderboardItems.map(leaderboardItem => ({
    ...leaderboardItem,
    totalDays: leaderboardItem.total_days,
    positionChange: leaderboardItem.position_change,
    checkedIn: leaderboardItem.checked_in,
  }));
}

// Table

export const leaderboardHeadCells: readonly TableHeadCell<LeaderboardItem>[] = [
  {
    id: "positionChange",
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
    id: "name",
    label: "Username",
    align: "left",
    padding: "normal",
  },
  {
    id: "checkedIn",
    label: "Checked In",
    align: "right",
    padding: "normal",
  },
  {
    id: "totalDays",
    label: "Total Days",
    align: "left",
    padding: "checkbox",
  },
];
