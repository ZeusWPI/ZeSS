import { Box, Paper, Stack, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { createContext, useEffect, useRef, useState } from "react";
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
    const daysRef = useRef<HTMLDivElement>(null);
    const heatmapSwitchRef = useRef<HTMLDivElement>(null);
    const [heatmapSwitchHeight, setHeatmapSwitchHeight] = useState<number>(0);
    const [paperHeight, setPaperHeight] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    useEffect(() => {
        if (daysRef.current) {
            setPaperHeight(daysRef.current.clientHeight);
        }

        if (heatmapSwitchRef.current) {
            setHeatmapSwitchHeight(heatmapSwitchRef.current.clientHeight);
        }
    });

    return (
        <LoadingSkeleton loading={loading}>
            <ScanContext.Provider value={{ scans }}>
                {scans.length > 0 ? (
                    <Grid
                        container
                        spacing={2}
                        alignItems="stretch"
                        justifyContent="space-between"
                    >
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
                                    padding: 1,
                                    width: "100%",
                                    height: { xs: "auto", lg: paperHeight },
                                }}
                            >
                                <BrowserView>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        justifyContent="flex-end"
                                        ref={heatmapSwitchRef}
                                    >
                                        <Typography>Months</Typography>
                                        <Switch
                                            checked={checked}
                                            onChange={handleChange}
                                        />
                                        <Typography>Days</Typography>
                                    </Stack>
                                </BrowserView>
                                <Heatmap
                                    startDate={new Date("2024-01-01")}
                                    endDate={new Date("2024-12-31")}
                                    variant={
                                        checked
                                            ? HeatmapVariant.DAYS
                                            : HeatmapVariant.MONTHS
                                    }
                                    maxHeight={
                                        paperHeight - heatmapSwitchHeight - 10
                                    }
                                />
                                <Tooltip id="heatmap" />
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
                    <Box
                        display="flex"
                        mt={10}
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Typography variant="h3" gutterBottom>
                            You don't have any scans.
                        </Typography>
                        <Typography variant="h5">
                            Start scanning to see some data!
                        </Typography>
                    </Box>
                )}
            </ScanContext.Provider>
        </LoadingSkeleton>
    );
};

// Current height of the heatmap is calculated using ref's and calculus
// TODO: Change it as it is very very very very very very ugly ^^
// Add a grid item underneath and see what happens
