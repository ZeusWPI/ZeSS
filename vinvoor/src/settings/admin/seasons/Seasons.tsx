import { Grid } from "@mui/material";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { SeasonsTable } from "./SeasonsTable";
import { SeasonsAdd } from "./SeasonsAdd";
import { useAdminSeasons } from "../../../hooks/admin/useAdminSeason";

export const Seasons = () => {
  const seasonsQuery = useAdminSeasons();

  return (
    <LoadingSkeleton queries={[seasonsQuery]}>
      <Grid
        container
        justifyContent="space-between"
        columnSpacing={4}
        rowSpacing={6}
      >
        <Grid item xs={12}>
          <SeasonsAdd />
        </Grid>
        <Grid item xs={12}>
          <SeasonsTable />
        </Grid>
      </Grid>
    </LoadingSkeleton>
  );
};
