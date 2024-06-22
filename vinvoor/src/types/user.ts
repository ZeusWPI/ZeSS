export interface User {
    id: number;
    username: string;
    admin: boolean;
    settings: Settings;
}

export interface Settings {
    scanInOut: boolean;
    leaderboard: boolean;
    public: boolean;
}
