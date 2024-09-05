import { Settings } from "./settings";

// External / Internal

export interface User {
  id: number;
  username: string;
  admin: boolean;
  settings: Settings;
}
