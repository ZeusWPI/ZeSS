import { Divider, Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useLeaderboardItems } from "../hooks/useLeaderboard";
import { LeaderboardTableBody } from "./LeaderboardTableBody";
import { LeaderboardTableToolbar } from "./LeaderboardTableToolbar";

export function Leaderboard() {
  const leaderboardQuery = useLeaderboardItems();

  return (
    <LoadingSkeleton queries={[leaderboardQuery]}>
      <Paper elevation={4}>
        <LeaderboardTableToolbar />
        <Divider sx={{ borderColor: "primary.main", borderBottomWidth: 3 }} />
        <TableContainer>
          <Table>
            <LeaderboardTableBody />
          </Table>
        </TableContainer>
      </Paper>
    </LoadingSkeleton>
  );
}
