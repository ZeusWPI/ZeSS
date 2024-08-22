import {
  converSettingsJSON,
  defaultSettings,
  Settings,
  SettingsJSON,
} from "../../types/settings";
import { createDataContext } from "../DataProvider";

export const {
  DataProvider: SettingsProvider,
  useDataContext: useSettingsContext,
} = createDataContext<Settings, SettingsJSON>(
  "settings",
  defaultSettings,
  converSettingsJSON,
);
