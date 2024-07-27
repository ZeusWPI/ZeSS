import { useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { FC, useContext } from "react";
import Chart from "react-apexcharts";
import { Scan } from "../../types/scans";
import { shiftDate } from "../../util/util";
import { ScanContext } from "../Overview";
import { HeatmapVariant } from "./Heatmap";

interface HeatmapNewProps {
    startDate: Date;
    endDate: Date;
    variant: HeatmapVariant;
}

interface SeriesPoint {
    x: string;
    y: number;
}

const WEEK_DAYS = Object.freeze({
    Sunday: 0,
    Saturday: 6,
    Friday: 5,
    Thursday: 4,
    Wednesday: 3,
    Tuesday: 2,
    Monday: 1,
});
const DAYS_IN_WEEK = 7;

const normalizeDates = (...args: Date[][]) => {
    args.forEach((dates) => dates.forEach((date) => date.setHours(0, 0, 0, 0)));
};

const getDayData = (startDate: Date, endDate: Date, scans: readonly Scan[]) => {
    const dates = [...scans].map((scan) => scan.scanTime);
    normalizeDates([startDate], [endDate], dates);

    const days: SeriesPoint[][] = [[], [], [], [], [], [], []];
    let index = 0;
    let week = startDate.getDay() === 1 ? -1 : 0;

    let currentDate = new Date(
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1)
    );

    while (currentDate <= endDate || currentDate.getDay() !== 1) {
        if (currentDate.getDay() === 1) week++;

        let amount = 0;

        if (dates[index]?.getTime() === currentDate.getTime()) {
            amount = 1;
            index++;
        }

        days[currentDate.getDay()].push({
            x: currentDate.toISOString(),
            y: amount,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return Object.entries(WEEK_DAYS).map(([day, dayIndex]) => ({
        name: day,
        data: days[dayIndex],
    })) as ApexAxisChartSeries;
};

const getMonthData = (
    startDate: Date,
    endDate: Date,
    scans: readonly Scan[]
) => {
    const dates = [...scans].map((scan) => scan.scanTime);
    normalizeDates([startDate], [endDate], dates);

    const weeks: SeriesPoint[][] = [[], [], [], [], []];
    let index = 0;
    let week = 0;
    let month = 0;

    let currentDate = shiftDate(startDate, -startDate.getDay() + 1);

    console.log(currentDate);

    while (currentDate.getDate() > DAYS_IN_WEEK)
        currentDate.setDate(currentDate.getDate() - DAYS_IN_WEEK);

    while (
        currentDate <= endDate ||
        currentDate.getDate() < DAYS_IN_WEEK ||
        currentDate.getDay() % DAYS_IN_WEEK !== 1
    ) {
        if (currentDate.getDate() <= DAYS_IN_WEEK) {
            week = 0;
            month++;
        } else week++;

        let amount = 0;
        let endOfWeek = new Date(currentDate).setDate(
            currentDate.getDate() + DAYS_IN_WEEK
        );
        while (
            dates[index]?.getTime() >= currentDate.getTime() &&
            dates[index]?.getTime() < endOfWeek
        ) {
            amount++;
            index++;
        }

        weeks[week].push({
            x: `M${month}`,
            y: amount,
        });

        currentDate.setDate(currentDate.getDate() + DAYS_IN_WEEK);
    }

    return weeks.map((week, index) => ({
        name: `Week ${index + 1}`,
        data: week,
    })) as ApexAxisChartSeries;
};

export const HeatmapNew: FC<HeatmapNewProps> = ({
    startDate,
    endDate,
    variant,
}) => {
    const theme = useTheme();
    const { scans } = useContext(ScanContext);

    const shortMonthName = new Intl.DateTimeFormat("en-GB", { month: "short" })
        .format;

    console.log(getMonthData(startDate, endDate, scans));

    const state = {
        options: {
            chart: {
                animation: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
                type: "heatmap",
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                show: false,
            },
            legend: {
                show: false,
            },
            tooltip: {},
            xaxis: {
                labels: {
                    formatter: (value: string) => {
                        const date = new Date(value);
                        return date.getDate() <= DAYS_IN_WEEK
                            ? shortMonthName(date)
                            : "";
                    },
                },
                position: "top",
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    formatter: (value: string) =>
                        shortMonthName(new Date(value)),
                },
            },
            yaxis: {
                labels: {
                    show: false,
                },
            },
            stroke: {
                width: 10,
                colors: [theme.palette.background.paper],
            },
            plotOptions: {
                heatmap: {
                    radius: 10,
                    useFillColorAsStroke: false,
                    enableShades: false,
                    colorScale: {
                        ranges:
                            variant === HeatmapVariant.DAYS
                                ? [
                                      {
                                          from: 0,
                                          to: 0,
                                          color: theme.heatmap.colorInActive
                                              .fill,
                                      },
                                      {
                                          from: 1,
                                          to: 1,
                                          color: theme.heatmap.colorActive.fill,
                                      },
                                  ]
                                : [
                                      {
                                          from: 0,
                                          to: 0,
                                          color: theme.heatmap.color0.fill,
                                      },
                                      {
                                          from: 1,
                                          to: 1,
                                          color: theme.heatmap.color1.fill,
                                      },
                                      {
                                          from: 2,
                                          to: 3,
                                          color: theme.heatmap.color2.fill,
                                      },
                                      {
                                          from: 3,
                                          to: 4,
                                          color: theme.heatmap.color3.fill,
                                      },
                                  ],
                    },
                },
            },
        } as ApexOptions,
        series:
            variant === HeatmapVariant.DAYS
                ? getDayData(startDate, endDate, scans)
                : getMonthData(startDate, endDate, scans),
    };

    return (
        <Chart options={state.options} series={state.series} type="heatmap" />
    );
};
