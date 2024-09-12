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
