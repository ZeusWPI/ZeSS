import { Base, BaseJSON } from "./general";

interface SettingsJSON extends BaseJSON {
    scanInOut: boolean;
    leaderboard: boolean;
    public: boolean;
}

export interface Settings extends Base {
    scanInOut: boolean;
    leaderboard: boolean;
    public: boolean;
}

export const converSettingsJSON = (settingsJSON: SettingsJSON): Settings => ({
    id: settingsJSON.id,
    createdAt: new Date(settingsJSON.createdAt),
    scanInOut: settingsJSON.scanInOut,
    leaderboard: settingsJSON.leaderboard,
    public: settingsJSON.public,
});

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
