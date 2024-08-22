import { Settings } from "./settings";

export interface User {
  id: number;
  username: string;
  admin: boolean;
  settings: Settings;
}
