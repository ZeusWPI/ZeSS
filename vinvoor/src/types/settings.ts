// External

export interface SettingsJSON {
  season: number;
}

// Internal

export interface Settings {
  season: number;
}

// Converters

export const converSettingsJSON = (settingsJSON: SettingsJSON): Settings => ({
  ...settingsJSON,
});

// // Table

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
