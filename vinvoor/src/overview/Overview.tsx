import { Box, Paper, Switch, Typography } from "@mui/material";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { Scan } from "../types/scans";
import { Heatmap, HeatmapVariant } from "./heatmap/Heatmap";

export const Overview = () => {
    const [scans, setScans] = useState<Scan[]>([]);
    const { loading } = useFetch<Scan[]>("scans", setScans);
    const [checked, setChecked] = useState<boolean>(true);

    const dates = scans.map((scan) => new Date(scan.scanTime));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <LoadingSkeleton loading={loading}>
            <Paper elevation={4} sx={{ padding: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "right",
                    }}
                >
                    <Typography variant="h6">Months</Typography>
                    <Switch checked={checked} onChange={handleChange} />
                    <Typography variant="h6">Days</Typography>
                </Box>
                <Heatmap
                    startDate={new Date("2024-01-01")}
                    endDate={new Date("2024-12-31")}
                    days={dates}
                    variant={
                        checked ? HeatmapVariant.DAYS : HeatmapVariant.MONTHS
                    }
                />
                <Tooltip id="heatmap" />
            </Paper>
        </LoadingSkeleton>
    );
};
