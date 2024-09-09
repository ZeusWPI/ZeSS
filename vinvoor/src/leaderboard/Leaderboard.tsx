import { Divider, Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { LeaderboardTableBody } from "./LeaderboardTableBody";
import { LeaderboardTableToolbar } from "./LeaderboardTableToolbar";
import { useLeaderboardItems } from "../hooks/useLeaderboard";

export const Leaderboard = () => {
  const { isLoading, isError } = useLeaderboardItems();

  return (
    <LoadingSkeleton isLoading={isLoading} isError={isError}>
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
};
