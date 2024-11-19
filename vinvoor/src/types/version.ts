// External

export interface VersionJSON {
  version: string;
}

// Internal

export interface Version {
  version: string;
}

// Converters

export function convertVersionJSON(versionJSON: VersionJSON): Version {
  return {
    ...versionJSON,
  };
}
