import { convertDayJSON, Day, DayJSON } from "../../types/days";
import { createDataContext } from "../DataProvider";

export const { DataProvider: DaysProvider, useDataContext: useDaysContext } =
  createDataContext<readonly Day[], DayJSON[]>(
    "admin/days",
    [],
    convertDayJSON,
  );
