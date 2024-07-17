import { TableHeadCell } from "./general";

export interface LeaderboardItem {
    position: number;
    userId: number;
    username: string;
    totalDays: number;
    positionChange: number;
}

export const leaderboardHeadCells: readonly TableHeadCell<LeaderboardItem>[] = [
    {
        id: "positionChange",
        label: "Change",
        align: "left",
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
        id: "totalDays",
        label: "Total Days",
        align: "right",
        padding: "normal",
    },
];
