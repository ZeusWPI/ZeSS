import {
  converSettingsJSON,
  defaultSettings,
  Settings,
} from "../../types/settings";
import { createDataContext } from "../DataProvider";

export const {
  DataProvider: SettingsProvider,
  useDataContext: useSettingsContext,
} = createDataContext<Settings>(
  "settings",
  defaultSettings,
  converSettingsJSON,
);
