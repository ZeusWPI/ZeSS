import { Box, Paper, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { createContext, useState } from "react";
import { BrowserView } from "react-device-detect";
import { Tooltip } from "react-tooltip";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { convertScanJSON, Scan } from "../types/scans";
import { CheckIn } from "./checkin/CheckIn";
import { Days } from "./days/Days";
import { Heatmap, HeatmapVariant } from "./heatmap/Heatmap";
import { Streak } from "./streak/Streak";

interface ScanContextProps {
    scans: readonly Scan[];
}

export const ScanContext = createContext<ScanContextProps>({
    scans: [],
});

export const Overview = () => {
    const [scans, setScans] = useState<readonly Scan[]>([]);
    const { loading } = useFetch<readonly Scan[]>(
        "scans",
        setScans,
        convertScanJSON
    );
    const [checked, setChecked] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <LoadingSkeleton loading={loading}>
            <ScanContext.Provider value={{ scans }}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <Grid item xs={8} md={6}>
                        <CheckIn />
                    </Grid>
                    <Grid item xs={4}>
                        <Streak />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={4} sx={{ padding: 2 }}>
                            <BrowserView>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "right",
                                    }}
                                >
                                    <Typography variant="h6">Months</Typography>
                                    <Switch
                                        checked={checked}
                                        onChange={handleChange}
                                    />
                                    <Typography variant="h6">Days</Typography>
                                </Box>
                            </BrowserView>
                            <Heatmap
                                startDate={new Date("2024-01-01")}
                                endDate={new Date("2024-12-31")}
                                variant={
                                    checked
                                        ? HeatmapVariant.DAYS
                                        : HeatmapVariant.MONTHS
                                }
                            />
                            <Tooltip id="heatmap" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={4}>
                            <Days />
                        </Paper>
                    </Grid>
                </Grid>
            </ScanContext.Provider>
        </LoadingSkeleton>
    );
};

// TODO: Checked in today
// TODO: Current streak
// TODO: Pie chart
