import { Grid } from "@mui/material";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { DaysAdd } from "./DaysAdd";
import { DaysTable } from "./DaysTable";
import { useAdminDays } from "../../../hooks/admin/useAdminDays";

export const Days = () => {
  const daysQuery = useAdminDays();

  return (
    <LoadingSkeleton queries={[daysQuery]}>
      <Grid
        container
        justifyContent="space-between"
        columnSpacing={4}
        rowSpacing={6}
      >
        <Grid item xs={12} md={6}>
          <DaysTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <DaysAdd />
        </Grid>
      </Grid>
    </LoadingSkeleton>
  );
};
