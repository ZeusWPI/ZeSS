import { Box, Paper, Stack, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLayoutEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { BrowserView } from "../components/BrowserView";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { CheckIn } from "./checkin/CheckIn";
import { Days } from "./days/Days";
import { Heatmap } from "./heatmap/Heatmap";
import { HeatmapVariant } from "./heatmap/types";
import { Streak } from "./streak/Streak";
import { useScans } from "../hooks/useScan";

export const Overview = () => {
  const { data: scans, isLoading } = useScans();
  const [checked, setChecked] = useState<boolean>(false);
  const daysRef = useRef<HTMLDivElement>(null);
  const [paperHeight, setPaperHeight] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useLayoutEffect(() => {
    if (daysRef.current)
      setPaperHeight(daysRef.current.getBoundingClientRect().height);
  });

  return (
    <LoadingSkeleton loading={isLoading}>
      {scans?.length ? (
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={8} md={4} lg={3}>
            <CheckIn />
          </Grid>
          <Grid item xs={4}>
            <Streak />
          </Grid>
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={4}
              sx={{
                padding: 2,
                width: "100%",
                height: paperHeight,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stack direction="column" sx={{}} width="100%" height="100%">
                <BrowserView onMobileView={() => setChecked(false)}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Typography>Months</Typography>
                    <Switch checked={checked} onChange={handleChange} />
                    <Typography>Days</Typography>
                  </Stack>
                </BrowserView>
                <Heatmap
                  startDate={new Date("2024-05-01")}
                  endDate={new Date("2024-09-30")}
                  variant={
                    checked ? HeatmapVariant.DAYS : HeatmapVariant.MONTHS
                  }
                />
                <Tooltip id="heatmap" />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <Paper
              elevation={4}
              sx={{ padding: 2, width: "100%" }}
              ref={daysRef}
            >
              <Days />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box display="flex" mt={10} flexDirection="column" alignItems="center">
          <Typography variant="h3" gutterBottom>
            You don't have any scans.
          </Typography>
          <Typography variant="h5">Start scanning to see some data!</Typography>
        </Box>
      )}
    </LoadingSkeleton>
  );
};
