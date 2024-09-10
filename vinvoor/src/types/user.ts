// External

export interface UserJSON {
  id: number;
  name: string;
  admin: boolean;
}

// Internal

export interface User {
  id: number;
  name: string;
  admin: boolean;
}

// Converters

export const convertUserJSON = (userJSON: UserJSON): User => ({ ...userJSON });

// TODO: Rename user directory to auth
// TODO: Convert user to tanstack query
