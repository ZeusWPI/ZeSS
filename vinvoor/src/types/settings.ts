// External

export interface SettingsJSON {
  season: number;
}

// Internal

export interface Settings {
  season: number;
}

// Converters

export function converSettingsJSON(settingsJSON: SettingsJSON): Settings {
  return {
    ...settingsJSON,
  };
}
