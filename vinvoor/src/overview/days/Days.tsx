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
    const { scans } = useContext(ScanContext);

    const state = {
        options: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            fill: {
                opacity: 1,
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
            theme: {
                monochrome: {
                    enabled: true,
                    color: "#ff7f00",
                    shadeTo: "light",
                    shadeIntensity: 1,
                },
            },
        } as ApexOptions,
        series: getDayCount(scans),
    };

    return (
        <Chart options={state.options} series={state.series} type="polarArea" />
    );
};
