import { Grid } from "@mui/material";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { useSeasons } from "../../../hooks/useSeasons";
import { SeasonsTable } from "./SeasonsTable";
import { SeasonsAdd } from "./SeasonsAdd";

export const Seasons = () => {
  const seasonsQuery = useSeasons();

  return (
    <LoadingSkeleton queries={[seasonsQuery]}>
      <Grid
        container
        justifyContent="space-between"
        columnSpacing={4}
        rowSpacing={4}
      >
        <Grid item xs={12} md={6}>
          <SeasonsTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <SeasonsAdd />
        </Grid>
      </Grid>
    </LoadingSkeleton>
  );
};
