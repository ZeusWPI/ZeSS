import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { useDaysContext } from "../../../providers/dataproviders/daysProvider";
import { convertDayJSON, Day, DayJSON } from "../../../types/days";
import { getApi } from "../../../util/fetch";
import { DaysAdd } from "./DaysAdd";
import { DaysTable } from "./DaysTable";

export const Days = () => {
  const { setData: setDays, loading } = useDaysContext();
  const { enqueueSnackbar } = useSnackbar();

  const reloadDays = () => {
    getApi<readonly Day[], DayJSON[]>("admin/days", convertDayJSON)
      .then(data => setDays(data))
      // This is the admin page so just show the error
      .catch(error =>
        enqueueSnackbar(`Error getting all days: ${error}`, {
          variant: "error",
        }),
      );
  };

  return (
    <LoadingSkeleton loading={loading}>
      <Grid
        container
        justifyContent="space-between"
        columnSpacing={4}
        rowSpacing={6}
      >
        <Grid item xs={12} md={6}>
          <DaysTable reloadDays={reloadDays} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DaysAdd reloadDays={reloadDays} />
        </Grid>
      </Grid>
    </LoadingSkeleton>
  );
};
