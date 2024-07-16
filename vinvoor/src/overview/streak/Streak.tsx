import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { Scan } from "../../types/scans";
import {
    isTheSameDay,
    MILLISECONDS_IN_ONE_DAY,
    shiftDate,
} from "../../util/util";
import { ScanContext } from "../Overview";

const isWeekendBetween = (date1: Date, date2: Date) => {
    const diffDays = Math.floor(
        (date2.getTime() - date1.getTime()) / MILLISECONDS_IN_ONE_DAY
    );

    if (diffDays > 2) return false;

    return date1.getDay() === 5 && [1, 6, 7].includes(date2.getDay());
};

const isStreakDay = (date1: Date, date2: Date) => {
    console.log(date1, date2);
    console.log(shiftDate(date2, 1));
    console.log(isTheSameDay(date1, shiftDate(date2, 1)));

    if (isTheSameDay(date1, shiftDate(date2, 1))) return true;

    if (date1.getDay() === 5 && [1, 6, 7].includes(date2.getDay()))
        return isWeekendBetween(date1, date2);

    return false;
};

const getStreak = (scans: readonly Scan[]): [boolean, number] => {
    let streak = 0;
    const isOnStreak =
        scans.length > 0 &&
        (isTheSameDay(scans[scans.length - 1].scanTime, new Date()) ||
            isWeekendBetween(scans[scans.length - 1].scanTime, new Date()));

    if (isOnStreak) {
        let i = scans.length;
        streak++;

        while (i-- > 1 && isStreakDay(scans[i].scanTime, scans[i - 1].scanTime))
            streak++;
    } else {
        streak = Math.floor(
            (new Date().getTime() -
                scans[scans.length - 1].scanTime.getTime()) /
                MILLISECONDS_IN_ONE_DAY -
                1
        );
    }

    return [isOnStreak, streak];
};

export const Streak = () => {
    const { scans } = useContext(ScanContext);
    const [isOnStreak, streak] = getStreak(scans);

    const color = isOnStreak ? "primary" : "error";
    const textEnd = isOnStreak ? "streak" : "absent";

    return (
        <Box display="flex" alignItems="flex-end" justifyContent="end">
            <Typography
                variant="h2"
                color={color}
                fontWeight="bold"
                sx={{ mr: 1 }}
            >
                {streak}
            </Typography>
            <Typography variant="body2" color={color}>
                day{streak > 1 ? "s" : ""} {textEnd}
            </Typography>
        </Box>
    );
};
