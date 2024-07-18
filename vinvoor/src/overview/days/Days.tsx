import { useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { useContext } from "react";
import Chart from "react-apexcharts";
import { Scan } from "../../types/scans";
import { ScanContext } from "../Overview";

const getDayCount = (scans: readonly Scan[]) => {
    const days = [0, 0, 0, 0, 0, 0, 0];
    scans.forEach((scan) => {
        days[scan.scanTime.getDay() - 1]++;
    });
    return days.slice(0, -2);
};

export const Days = () => {
    const theme = useTheme();
    const { scans } = useContext(ScanContext);

    const state = {
        options: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            colors: [
                theme.days.color0,
                theme.days.color1,
                theme.days.color2,
                theme.days.color3,
                theme.days.color4,
            ],
            fill: {
                opacity: 0.9,
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "vertical",
                    shadeIntensity: 0.2,
                },
            },
            stroke: {
                show: false,
            },
            yaxis: {
                show: false,
            },
            legend: {
                position: "bottom",
                labels: {
                    useSeriesColors: true,
                },
            },
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeWidth: 0,
                    },
                    spokes: {
                        strokeWidth: 0,
                    },
                },
            },
        } as ApexOptions,
        series: getDayCount(scans),
    };

    return (
        <Chart options={state.options} series={state.series} type="polarArea" />
    );
};
