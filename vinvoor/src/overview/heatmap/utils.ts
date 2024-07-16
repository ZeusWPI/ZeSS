// Exports

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

export const getMonthLabelSize = () => SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE;

export const getMonthLabelCoordinates = (column: number) => [
    column * getSquareSize(),
    getMonthLabelSize() - MONTH_LABEL_GUTTER_SIZE,
];

// Transforms

export const getTransformForColumn = (column: number) =>
    `translate(${column * getSquareSize() + GUTTERSIZE}, 0)`;

export const getTransformForAllWeeks = () =>
    `translate(0, ${getMonthLabelSize()})`;

export const getTransformForMonthLabels = () => `translate(0, 0)`;

export const getWidth = (
    startDate: Date,
    endDate: Date,
    variant: HeatmapVariant
) => getColumnCount(startDate, endDate, variant) * getSquareSize() + GUTTERSIZE;

export const getHeight = (variant: HeatmapVariant) => {
    if (variant === HeatmapVariant.DAYS)
        return DAYS_IN_WEEK * getSquareSize() + getMonthLabelSize();
    else return WEEKS_IN_MONTH * getSquareSize() + getMonthLabelSize();
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

// Local functions

const GUTTERSIZE = 5;
const MONTH_LABEL_GUTTER_SIZE = 8;

const getSquareSize = () => SQUARE_SIZE + GUTTERSIZE;
