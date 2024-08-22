import { Paper, Table, TableContainer } from "@mui/material";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCardsContext } from "../providers/dataproviders/cardsProvider";
import { useScansContext } from "../providers/dataproviders/scansProvider";
import { ScansTableBody } from "./ScansTableBody";
import { ScansTableHead } from "./ScansTableHead";

export const Scans = () => {
  const { loading: loadingScans } = useScansContext();
  const { loading: loadingCards } = useCardsContext();

  return (
    <LoadingSkeleton loading={loadingScans && loadingCards}>
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
