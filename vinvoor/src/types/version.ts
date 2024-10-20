// External

export interface VersionJSON {
  version: string;
}

// Internal

export interface Version {
  version: string;
}

// Converters

export const convertVersionJSON = (versionJSON: VersionJSON): Version => ({
  ...versionJSON,
});
