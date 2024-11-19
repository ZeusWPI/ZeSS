import { Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCards } from "../hooks/useCard";
import { useScans } from "../hooks/useScan";
import { ScansTableBody } from "./ScansTableBody";
import { ScansTableHead } from "./ScansTableHead";

export function Scans() {
  const scansQuery = useScans();
  const cardsQuery = useCards();

  return (
    <LoadingSkeleton queries={[scansQuery, cardsQuery]}>
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
}
