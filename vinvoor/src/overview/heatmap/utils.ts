// Exports

import { HeatmapVariant } from "./Heatmap";

// Constants

export const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
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

export const getMonthLabelSize = () => {
    return SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE;
};

export const getMonthLabelCoordinates = (column: number) => {
    return [
        column * getSquareSize(),
        getMonthLabelSize() - MONTH_LABEL_GUTTER_SIZE,
    ];
};

// Transforms

export const getTransformForColumn = (column: number) => {
    return `translate(${column * getSquareSize() + GUTTERSIZE}, 0)`;
};

export const getTransformForAllWeeks = () => {
    return `translate(0, ${getMonthLabelSize()})`;
};

export const getTransformForMonthLabels = () => {
    return `translate(0, 0)`;
};

export const getWidth = (
    startDate: Date,
    endDate: Date,
    variant: HeatmapVariant
) => {
    return (
        getColumnCount(startDate, endDate, variant) * getSquareSize() +
        GUTTERSIZE
    );
};

export const getHeight = (variant: HeatmapVariant) => {
    if (variant === HeatmapVariant.DAYS) {
        return DAYS_IN_WEEK * getSquareSize() + getMonthLabelSize();
    } else {
        return WEEKS_IN_MONTH * getSquareSize() + getMonthLabelSize();
    }
};

// Coordinate

export const getSquareCoordinates = (dayIndex: number) => {
    return [0, dayIndex * getSquareSize()];
};

// Utils

export const getEmpty = (date: Date, variant: HeatmapVariant) => {
    if (variant === HeatmapVariant.DAYS) {
        return (date.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK;
    } else {
        return Math.floor((date.getDate() - 1) / DAYS_IN_WEEK);
    }
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

export const shiftDate = (date: Date, numDays: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
};

// Local functions

const GUTTERSIZE = 5;
const MONTH_LABEL_GUTTER_SIZE = 4;

const getSquareSize = () => {
    return SQUARE_SIZE + GUTTERSIZE;
};
