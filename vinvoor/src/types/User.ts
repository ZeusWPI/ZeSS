export interface User {
    id: number;
    username: string;
    admin: boolean;
    settings: Settings;
}

export interface Settings {
    scan_in_out: boolean;
    leaderboard: boolean;
    public: boolean;
}
