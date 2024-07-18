import { Box } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { FC, useContext } from "react";
import { MILLISECONDS_IN_ONE_DAY, shiftDate } from "../../util/util";
import { ScanContext } from "../Overview";
import "./heatmap.css";
import {
    dateTimeFormat,
    DAYS_IN_WEEK,
    getColumnCount,
    getEmpty,
    getHeight,
    getMonthLabelCoordinates,
    getSquareCoordinates,
    getTransformForAllWeeks,
    getTransformForColumn,
    getTransformForMonthLabels,
    getWidth,
    MONTH_LABELS,
    SQUARE_SIZE,
    styleMonth,
} from "./utils";

export interface HeatmapItem {
    date: Date;
    count: number;
}

export enum HeatmapVariant {
    DAYS,
    MONTHS,
}

interface HeatmapProps {
    startDate: Date;
    endDate: Date;
    variant: HeatmapVariant;
    maxHeight: number;
}

const getAllValues = (
    days: readonly Date[],
    startDate: Date,
    endDate: Date,
    variant: HeatmapVariant
): HeatmapItem[] => {
    const values: readonly HeatmapItem[] = days.map((date) => ({
        date,
        count: 1,
    }));
    if (variant === HeatmapVariant.DAYS) {
        return Array.from(
            {
                length:
                    (endDate.getTime() - startDate.getTime()) /
                        MILLISECONDS_IN_ONE_DAY +
                    1,
            },
            (_, i) => {
                const date = shiftDate(startDate, i);
                return (
                    values.find((v) => v.date.getTime() === date.getTime()) || {
                        date,
                        count: 0,
                    }
                );
            }
        );
    } else {
        return Array.from(
            {
                length: getColumnCount(startDate, endDate, HeatmapVariant.DAYS),
            },
            (_, i) => {
                const start = shiftDate(startDate, i * DAYS_IN_WEEK);
                const count = Array.from({
                    length: DAYS_IN_WEEK,
                }).reduce<number>((sum, _, j) => {
                    const date = shiftDate(start, j);
                    const value = values.find(
                        (v) => v.date.getTime() === date.getTime()
                    );
                    return sum + (value ? value.count : 0);
                }, 0);

                return { date: start, count };
            }
        );
    }
};

const getWeeksInMonth = (
    values: HeatmapItem[],
    startDate: Date
): Record<number, number> => {
    const startYear = values[0].date.getFullYear();
    return values.reduce(
        (acc, value) => {
            const index =
                (value.date.getFullYear() - startYear) * 12 +
                value.date.getMonth() -
                startDate.getMonth();
            acc[index] = (acc[index] || 0) + 1;
            return acc;
        },
        {
            [startDate.getMonth()]: getEmpty(
                values[0].date,
                HeatmapVariant.MONTHS
            ),
        } as {
            [key: number]: number;
        }
    );
};

const getRectStyling = (
    theme: Theme,
    value: HeatmapItem,
    variant: HeatmapVariant
) => {
    if (variant === HeatmapVariant.DAYS)
        if (value.count > 0) return theme.heatmap.colorActive;
        else return theme.heatmap.colorInActive;
    else return styleMonth[Math.min(value.count, 5)](theme);
};

const getTextStyling = (theme: Theme, variant: HeatmapVariant) => {
    return {
        fill: theme.palette.primary.contrastText,
        fontSize: variant === HeatmapVariant.DAYS ? "1.8rem" : "0.8rem",
    };
};

const getTooltipDataAttrsForDate = (
    value: HeatmapItem,
    variant: HeatmapVariant
) => ({
    "data-tooltip-id": "heatmap",
    "data-tooltip-content":
        variant === HeatmapVariant.DAYS
            ? getTooltipDataAttrsForDays(value)
            : getTooltipDataAttrsForMonths(value),
});

const getTooltipDataAttrsForDays = (value: HeatmapItem) =>
    `${value.count > 0 ? "Present" : "Absent"} on ${dateTimeFormat.format(
        value.date
    )}`;

const getTooltipDataAttrsForMonths = (value: HeatmapItem) =>
    `${value.count} scan${
        value.count !== 1 ? "s" : ""
    } in the week of ${dateTimeFormat.format(value.date)}`;

export const Heatmap: FC<HeatmapProps> = ({
    startDate,
    endDate,
    variant,
    maxHeight,
}) => {
    const theme = useTheme();
    const { scans } = useContext(ScanContext);

    const days = scans.map((scan) => scan.scanTime);

    days.forEach((date) => date.setHours(0, 0, 0, 0));
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const values = getAllValues(days, startDate, endDate, variant);

    const viewBox = `0 0 ${getWidth(startDate, endDate, variant)} ${getHeight(
        variant
    )}`;

    const weeksInMonth =
        variant === HeatmapVariant.MONTHS
            ? getWeeksInMonth(values, startDate)
            : {}; // Amount of weeks in each month

    const columns = getColumnCount(startDate, endDate, variant); // Amount of columns of squares
    const emptyStart = getEmpty(startDate, variant); // Amount of empty squares at the start
    const emptyEnd = getEmpty(endDate, variant); // Amount of empty squares at the end

    let valueIndex = 0;
    const renderSquare = (row: number, column: number) => {
        if (column === 0 && row < emptyStart) return null;

        if (variant === HeatmapVariant.DAYS)
            if (column === columns - 1 && row > emptyEnd) return null;

        const value = values[valueIndex++];

        const [x, y] = getSquareCoordinates(row);

        return (
            <rect
                key={row}
                width={SQUARE_SIZE}
                height={SQUARE_SIZE}
                x={x}
                y={y}
                rx={2}
                ry={2}
                {...getRectStyling(theme, value, variant)}
                {...getTooltipDataAttrsForDate(value, variant)}
                className="rect"
            />
        );
    };

    const renderColumn = (column: number) => (
        <g key={column} transform={getTransformForColumn(column)}>
            {[
                ...Array(
                    variant === HeatmapVariant.DAYS
                        ? DAYS_IN_WEEK
                        : weeksInMonth[column]
                ).keys(),
            ].map((row) => renderSquare(row, column))}
        </g>
    );

    const renderColumns = () =>
        [...Array(columns).keys()].map((column) => renderColumn(column));

    const renderMonthLabels = () => {
        if (variant === HeatmapVariant.DAYS) {
            return [...Array(columns).keys()].map((column) => {
                const endOfWeek = shiftDate(startDate, column * DAYS_IN_WEEK);
                const [x, y] = getMonthLabelCoordinates(variant, column);

                return endOfWeek.getDate() >= 1 &&
                    endOfWeek.getDate() <= DAYS_IN_WEEK ? (
                    <text
                        key={column}
                        x={x}
                        y={y}
                        {...getTextStyling(theme, variant)}
                    >
                        {MONTH_LABELS[endOfWeek.getMonth()]}
                    </text>
                ) : null;
            });
        } else {
            return [...Array(columns).keys()].map((column) => {
                if (column % 2 === 1) {
                    return null;
                }

                const [x, y] = getMonthLabelCoordinates(variant, column);

                return (
                    <text
                        key={column}
                        x={x}
                        y={y}
                        {...getTextStyling(theme, variant)}
                    >
                        {MONTH_LABELS[startDate.getMonth() + column]}
                    </text>
                );
            });
        }
    };

    return (
        <Box maxHeight={maxHeight} sx={{ display: "flex" }}>
            <svg className="heatmap" viewBox={viewBox}>
                <g transform={getTransformForMonthLabels()}>
                    {renderMonthLabels()}
                </g>
                <g transform={getTransformForAllWeeks(variant)}>
                    {renderColumns()}
                </g>
            </svg>
        </Box>
    );
};
