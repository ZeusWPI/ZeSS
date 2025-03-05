import type { Scan } from "../../types/scans";
import { Box, Typography } from "@mui/material";
import { useScans } from "../../hooks/useScan";
import {
  isTheSameDay,
  MILLISECONDS_IN_ONE_DAY,
  shiftDate,
} from "../../util/util";

function isWeekendBetween(date1: Date, date2: Date) {
  const diffDays = Math.floor(
    (date2.getTime() - date1.getTime()) / MILLISECONDS_IN_ONE_DAY,
  );

  if (diffDays > 2)
    return false;

  return date1.getDay() === 5 && [1, 6, 7].includes(date2.getDay());
}

function isStreakDay(date1: Date, date2: Date) {
  if (isTheSameDay(date1, shiftDate(date2, 1)))
    return true;

  if (date1.getDay() === 5 && [1, 6, 7].includes(date2.getDay()))
    return isWeekendBetween(date1, date2);

  return false;
}

function getStreak(scans: readonly Scan[]): [boolean, number] {
  const dates = scans
    .map((scan) => {
      const date = new Date(scan.scanTime);
      date.setHours(0, 0, 0, 0);
      return date;
    })
    .filter((value, index, array) => {
      return (
        array.findIndex(date => date.getTime() === value.getTime()) === index
      );
    });
  dates.sort((a, b) => a.getTime() - b.getTime());

  let streak = 0;

  const isOnStreak
    = isTheSameDay(dates[dates.length - 1], new Date())
      || isWeekendBetween(dates[dates.length - 1], new Date());

  if (isOnStreak) {
    let i = dates.length;
    streak++;

    while (i-- > 1 && isStreakDay(dates[i], dates[i - 1])) streak++;
  }
  else {
    streak
      = dates.length > 0
        ? Math.floor(
            (new Date().getTime() - dates[dates.length - 1].getTime())
            / MILLISECONDS_IN_ONE_DAY
            - 1,
          )
        : 0;
  }

  return [isOnStreak, streak];
}

export function Streak() {
  const { data: scans } = useScans();
  if (!scans)
    return null; // Can never happen

  const [isOnStreak, streak] = getStreak(scans);

  const color = isOnStreak ? "primary" : "error";
  const textEnd = isOnStreak ? "streak" : "absent";

  return streak === 0
    ? (
        <Box
          display="flex"
          justifyContent="center"
          textAlign="center"
          alignItems="center"
          height="100%"
          borderTop={theme => `1px solid ${theme.palette.primary.main}`}
          borderBottom={theme => `1px solid ${theme.palette.primary.main}`}
        >
          <Typography variant="h6" color="primary">
            Scan to retain streak
          </Typography>
        </Box>
      )
    : (
        <Box display="flex" alignItems="flex-end" justifyContent="end">
          <Typography variant="h2" color={color} fontWeight="bold" sx={{ mr: 1 }}>
            {streak}
          </Typography>
          <Typography variant="body2" color={color}>
            day
            {streak > 1 ? "s" : ""}
            {" "}
            {textEnd}
          </Typography>
        </Box>
      );
}
