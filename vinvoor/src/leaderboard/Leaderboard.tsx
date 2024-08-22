import { Divider, Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useLeaderboardContext } from "../providers/dataproviders/leaderboardProvider";
import { LeaderboardTableBody } from "./LeaderboardTableBody";
import { LeaderboardTableToolbar } from "./LeaderboardTableToolbar";

export const Leaderboard = () => {
  const { data: leaderboardItems, loading } = useLeaderboardContext();

  return (
    <LoadingSkeleton loading={loading}>
      <Paper elevation={4}>
        <LeaderboardTableToolbar />
        <Divider sx={{ borderColor: "primary.main", borderBottomWidth: 3 }} />
        <TableContainer>
          <Table>
            <LeaderboardTableBody leaderboardItems={leaderboardItems} />
          </Table>
        </TableContainer>
      </Paper>
    </LoadingSkeleton>
  );
};
