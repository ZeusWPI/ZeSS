import { Base, BaseJSON } from "./general";

// External

export interface SettingsJSON extends BaseJSON {
  scan_in_out: boolean;
  leaderboard: boolean;
  public: boolean;
}

// Internal

export interface Settings extends Base {
  scanInOut: boolean;
  leaderboard: boolean;
  public: boolean;
}

// Converters

export const converSettingsJSON = (settingsJSON: SettingsJSON): Settings => ({
  ...settingsJSON,
  createdAt: new Date(settingsJSON.created_at),
  scanInOut: settingsJSON.scan_in_out,
});

// Table

interface AdjustableSettings {
  id: keyof Settings;
  name: string;
  description: string;
}

export const adjustableSettings: AdjustableSettings[] = [
  {
    id: "scanInOut",
    name: "Scan in and out",
    description:
      "A second scan on the same day will be interpreted as a scan out",
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    description: "Show yourself on the leaderboard",
  },
  {
    id: "public",
    name: "Public",
    description: "Let others see you!",
  },
];
