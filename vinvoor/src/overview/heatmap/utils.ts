// Exports

import { Theme } from "@mui/material/styles";
import { MILLISECONDS_IN_ONE_DAY } from "../../util/util";
import { HeatmapVariant } from "./Heatmap";

// Constants

export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_MONTH = 5;
export const SQUARE_SIZE = 10;

export const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
    year: "2-digit",
    month: "short",
    day: "numeric",
});

// Labels

export const getMonthLabelSize = (variant: HeatmapVariant) =>
    SQUARE_SIZE +
    MONTH_LABEL_GUTTER_SIZE(variant) +
    MONTH_LABEL_OFFSET(variant);

export const getMonthLabelCoordinates = (
    variant: HeatmapVariant,
    column: number
) => [
    column * getSquareSize(),
    getMonthLabelSize(variant) - MONTH_LABEL_GUTTER_SIZE(variant),
];

// Transforms

export const getTransformForColumn = (column: number) =>
    `translate(${column * getSquareSize() + GUTTERSIZE}, 0)`;

export const getTransformForAllWeeks = (variant: HeatmapVariant) =>
    `translate(0, ${getMonthLabelSize(variant)})`;

export const getTransformForMonthLabels = () => `translate(0, 0)`;

export const getWidth = (
    startDate: Date,
    endDate: Date,
    variant: HeatmapVariant
) => getColumnCount(startDate, endDate, variant) * getSquareSize() + GUTTERSIZE;

export const getHeight = (variant: HeatmapVariant) => {
    if (variant === HeatmapVariant.DAYS)
        return DAYS_IN_WEEK * getSquareSize() + getMonthLabelSize(variant);
    else return WEEKS_IN_MONTH * getSquareSize() + getMonthLabelSize(variant);
};

// Coordinate

export const getSquareCoordinates = (dayIndex: number) => [
    0,
    dayIndex * getSquareSize(),
];

// Utils

export const getEmpty = (date: Date, variant: HeatmapVariant) => {
    if (variant === HeatmapVariant.DAYS)
        return (date.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
    else return Math.floor((date.getDate() - 1) / DAYS_IN_WEEK);
};

export const getColumnCount = (
    startDate: Date,
    endDate: Date,
    variant: HeatmapVariant
) => {
    if (variant === HeatmapVariant.DAYS) {
        return Math.ceil(
            (endDate.getTime() - startDate.getTime()) /
                (DAYS_IN_WEEK * MILLISECONDS_IN_ONE_DAY)
        );
    } else {
        return (
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth() + 1)
        );
    }
};

export const styleMonth = [
    (theme: Theme) => theme.heatmap.color0,
    (theme: Theme) => theme.heatmap.color1,
    (theme: Theme) => theme.heatmap.color2,
    (theme: Theme) => theme.heatmap.color3,
    (theme: Theme) => theme.heatmap.color4,
    (theme: Theme) => theme.heatmap.color5,
];

// Local functions

const GUTTERSIZE = 5;
const MONTH_LABEL_GUTTER_SIZE = (variant: HeatmapVariant) =>
    variant === HeatmapVariant.DAYS ? 15 : 8;
const MONTH_LABEL_OFFSET = (variant: HeatmapVariant) =>
    variant === HeatmapVariant.DAYS ? 15 : 0;

const getSquareSize = () => SQUARE_SIZE + GUTTERSIZE;
