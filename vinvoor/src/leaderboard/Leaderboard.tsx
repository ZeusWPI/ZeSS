import { Divider, Paper, Table, TableContainer } from "@mui/material";
import { useState } from "react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { LeaderboardItem } from "../types/leaderboard";
import { LeaderboardTableBody } from "./LeaderboardTableBody";
import { LeaderboardTableToolbar } from "./LeaderboardTableToolbar";

export const Leaderboard = () => {
    const [leaderboardItems, setLeaderboardItems] = useState<
        readonly LeaderboardItem[]
    >([]);
    const { loading } = useFetch<readonly LeaderboardItem[]>(
        "leaderboard",
        setLeaderboardItems
    );

    return (
        <LoadingSkeleton loading={loading}>
            <Paper elevation={4}>
                <LeaderboardTableToolbar />
                <Divider
                    sx={{ bgcolor: "primary.main", borderBottomWidth: 3 }}
                />
                <TableContainer>
                    <Table>
                        <LeaderboardTableBody
                            leaderboardItems={leaderboardItems}
                        />
                    </Table>
                </TableContainer>
            </Paper>
        </LoadingSkeleton>
    );
};
