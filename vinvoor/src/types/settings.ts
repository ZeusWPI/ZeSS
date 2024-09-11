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

// Table

interface AdjustableSettings {
  id: keyof Settings;
  name: string;
  description: string;
}

export const adjustableSettings: AdjustableSettings[] = [
  {
    id: "season",
    name: "Selected season",
    description: "The season you are currently viewing",
  },
];
