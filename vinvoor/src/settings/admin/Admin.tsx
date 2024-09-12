import { Alert, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { Days } from "./days/Days";
import { Seasons } from "./seasons/Seasons";

export const Admin: FC = () => {
  return (
    <Grid
      container
      justifyContent="space-between"
      columnSpacing={4}
      rowSpacing={6}
    >
      <Grid item xs={12}>
        <Alert
          variant="outlined"
          color="error"
          icon={false}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Typography variant="h4">
            This page doesn't ask for confirmation when modifying data !
          </Typography>
        </Alert>
      </Grid>
      <Grid item xs={12} md={6}>
        <Days />
      </Grid>
      <Grid item xs={12} md={6}>
        <Seasons />
      </Grid>
    </Grid>
  );
};
