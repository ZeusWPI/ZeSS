import { TableHeadCell } from "./table";

export interface LeaderboardItem {
    position: number;
    username: string;
    totalDays: number;
}

export const leaderboardHeadCells: readonly TableHeadCell<LeaderboardItem>[] = [
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
