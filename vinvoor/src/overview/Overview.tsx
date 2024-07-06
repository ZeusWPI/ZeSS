import { Box, Paper, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { createContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { convertScanJSON, Scan } from "../types/scans";
import { CheckIn } from "./checkin/CheckIn";
import { Heatmap, HeatmapVariant } from "./heatmap/Heatmap";

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
    const [checked, setChecked] = useState<boolean>(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <LoadingSkeleton loading={loading}>
            <ScanContext.Provider value={{ scans }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <CheckIn />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={4} sx={{ padding: 2 }}>
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
                </Grid>
            </ScanContext.Provider>
        </LoadingSkeleton>
    );
};

// TODO: Checked in today
// TODO: Current streak
// TODO: Pie chart
