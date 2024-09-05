import { Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { ScansTableBody } from "./ScansTableBody";
import { ScansTableHead } from "./ScansTableHead";
import { useScans } from "../hooks/useScan";
import { useCards } from "../hooks/useCard";

export const Scans = () => {
  const { isLoading: isLoadingScans } = useScans();
  const { isLoading: isLoadingCards } = useCards();

  return (
    <LoadingSkeleton loading={isLoadingScans || isLoadingCards}>
      <Paper elevation={4}>
        <TableContainer>
          <Table>
            <ScansTableHead />
            <ScansTableBody />
          </Table>
        </TableContainer>
      </Paper>
    </LoadingSkeleton>
  );
};
