import { Box, Paper, Stack, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { BrowserView } from "../components/BrowserView";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { CheckIn } from "./checkin/CheckIn";
import { Days } from "./days/Days";
import { Heatmap } from "./heatmap/Heatmap";
import { HeatmapVariant } from "./heatmap/types";
import { Streak } from "./streak/Streak";
import { useScans } from "../hooks/useScan";
import { useSeasons } from "../hooks/useSeasons";
import { useSettings } from "../hooks/useSettings";

export const Overview = () => {
  const scansQuery = useScans();
  const seasonsQuery = useSeasons();
  const settingsQuery = useSettings();
  const [checked, setChecked] = useState<boolean>(false);
  const daysRef = useRef<HTMLDivElement>(null);
  const [paperHeight, setPaperHeight] = useState<number>(0);
  const [heatmapDates, setHeatmapDates] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useLayoutEffect(() => {
    if (daysRef.current)
      setPaperHeight(daysRef.current.getBoundingClientRect().height);
  });

  useEffect(() => {
    const currentSeason = seasonsQuery.data?.find(
      season => season.id === settingsQuery.data?.season,
    );

    if (currentSeason) {
      if (currentSeason.id === 1 && seasonsQuery.data) {
        const seasons = [...seasonsQuery.data];
        seasons.sort((a, b) => a.start.getTime() - b.start.getTime());
        setHeatmapDates([
          seasons.length > 1 ? seasons[1].start : seasons[0].start,
          new Date(),
        ]);
      } else {
        setHeatmapDates([currentSeason.start, currentSeason.end]);
      }
    }
  }, [seasonsQuery.data, settingsQuery.data]);

  return (
    <LoadingSkeleton queries={[scansQuery, seasonsQuery, settingsQuery]}>
      {scansQuery.data?.length ? (
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
                  startDate={heatmapDates[0]}
                  endDate={heatmapDates[1]}
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
        <Paper elevation={4} sx={{ padding: 2, mt: 10 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h3" gutterBottom>
              You don't have any scans.
            </Typography>
            <Typography variant="h5">
              Start scanning to see some data!
            </Typography>
          </Box>
        </Paper>
      )}
    </LoadingSkeleton>
  );
};
