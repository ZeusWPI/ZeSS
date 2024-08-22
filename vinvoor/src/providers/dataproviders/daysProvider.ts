import { convertDayJSON, Day } from "../../types/days";
import { createDataContext } from "../DataProvider";

export const { DataProvider: DaysProvider, useDataContext: useDaysContext } =
  createDataContext<readonly Day[]>("admin/days", [], convertDayJSON);
