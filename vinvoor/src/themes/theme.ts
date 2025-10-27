import type { ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material";

const baseTheme: ThemeOptions = {
  palette: {
    secondary: {
      main: "#ffffff",
      contrastText: "#ffffff",
    },
  },
  leaderboard: {
    first: "#daa520",
    second: "#c0c0c0",
    third: "#934b01",
  },
  heatmap: {
    color0: { fill: "#eeeeee", stroke: "#fcce9f" },
    color1: { fill: "#fcce9f", stroke: "#fcbb79" },
    color2: { fill: "#fcbb79", stroke: "#fa922a" },
    color3: { fill: "#fa922a", stroke: "#ff7f00" },
    color4: { fill: "#ff7f00", stroke: "#ba5f02" },
    color5: { fill: "#ba5f02", stroke: "#934b01" },
    colorActive: { fill: "#ff7f00", stroke: "#ba5f02" },
    colorInActive: { fill: "#eeeeee", stroke: "#fcce9f" },
    colorUnreachable: { fill: "#b0b0b0", stroke: "" },
  },
  days: {
    color0: "#fcbb79",
    color1: "#fa922a",
    color2: "#ff7f00",
    color3: "#ba5f02",
    color4: "#934b01",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "rgb(255,164,0) linear-gradient(45deg, rgba(255,164,0,1) 0%, rgba(255,127,0,1) 100%)",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: "light",
    primary: {
      main: "#ff7f00",
      contrastText: "#121212",
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: "dark",
    primary: {
      main: "#ff7f00",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212",
    },
  },
});

export const kakTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6F4E37",
      contrastText: "#28282B",
    },
    secondary: {
      main: "#A67B5B",
      contrastText: "#E9DCC9",
    },
    background: {
      default: "#FED8B1",
      paper: "#ECB176",
    },
    success: {
      main: "#355E3B",
      dark: "#454B1B",
      light: "#009E60",
    },
    error: {
      main: "#800020",
      dark: "#800000",
      light: "#A52A2A",
    },
  },
  leaderboard: {
    first: "#daa520",
    second: "#c0c0c0",
    third: "#934b01",
  },
  heatmap: {
    color0: { fill: "#EADDCA", stroke: "#DAA06D" },
    color1: { fill: "#DAA06D", stroke: "#d68c3c" },
    color2: { fill: "#d68c3c", stroke: "#a6621b" },
    color3: { fill: "#a6621b", stroke: "#8B4513" },
    color4: { fill: "#8B4513", stroke: "#5c300f" },
    color5: { fill: "#5c300f", stroke: "#381b06" },
    colorActive: { fill: "#8B4513", stroke: "#5c300f" },
    colorInActive: { fill: "#EADDCA", stroke: "#DAA06D" },
    colorUnreachable: { fill: "#b0b0b0", stroke: "" },
  },
  days: {
    color0: "#d68c3c",
    color1: "#a6621b",
    color2: "#8B4513",
    color3: "#5c300f",
    color4: "#381b06",
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#6F4E37",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #6F4E37",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          "borderWidth": "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
        contained: {
          color: "#FFF8DC",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          succ: "#6F4E37",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        outlinedError: {
          borderColor: "#800020",
        },
        outlinedSuccess: {
          borderColor: "#355E3B",
        },
      },
    },
  },
});

export const retroTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#244855",
    },
    secondary: {
      main: "#E64833",
    },
    background: {
      default: "#FBE9D0",
      paper: "#F3DDC7",
    },
    success: {
      main: "#008000",
    },
    error: {
      main: "#ab0c26",
      dark: "#7a0f20",
    },
    info: {
      main: "#024950",
    },
  },
  leaderboard: {
    first: "#FFE55C",
    second: "#E0E0E0",
    third: "#DAAA5E",
  },
  heatmap: {
    color0: { fill: "#e9ded1", stroke: "#ccc1b1" },
    color1: { fill: "#ccc1b1", stroke: "#a5a59b" },
    color2: { fill: "#a5a59b", stroke: "#778482" },
    color3: { fill: "#778482", stroke: "#50686d" },
    color4: { fill: "#50686d", stroke: "#244855" },
    color5: { fill: "#244855", stroke: "#193540" },
    colorActive: { fill: "#50686d", stroke: "#244855" },
    colorInActive: { fill: "#e9ded1", stroke: "#ccc1b1" },
    colorUnreachable: { fill: "#b0b0b0", stroke: "" },
  },
  days: {
    color0: "#a3bfd0",
    color1: "#7f9dad",
    color2: "#5b7c8a",
    color3: "#406270",
    color4: "#244855",
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #874F41",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        outlinedError: {
          borderColor: "#7a0f20",
        },
        outlinedSuccess: {
          borderColor: "#008000",
        },
      },
    },
  },
});

export interface HeatmapRectStyle {
  fill: string;
  stroke: string;
}

declare module "@mui/material/styles" {
  interface Theme {
    leaderboard: {
      first: string;
      second: string;
      third: string;
    };
    heatmap: {
      color0: HeatmapRectStyle;
      color1: HeatmapRectStyle;
      color2: HeatmapRectStyle;
      color3: HeatmapRectStyle;
      color4: HeatmapRectStyle;
      color5: HeatmapRectStyle;
      colorActive: HeatmapRectStyle;
      colorInActive: HeatmapRectStyle;
      colorUnreachable: HeatmapRectStyle;
    };
    days: {
      color0: string;
      color1: string;
      color2: string;
      color3: string;
      color4: string;
    };
  }
  interface ThemeOptions {
    leaderboard?: {
      first: string;
      second: string;
      third: string;
    };
    heatmap?: {
      color0: HeatmapRectStyle;
      color1: HeatmapRectStyle;
      color2: HeatmapRectStyle;
      color3: HeatmapRectStyle;
      color4: HeatmapRectStyle;
      color5: HeatmapRectStyle;
      colorInActive: HeatmapRectStyle;
      colorActive: HeatmapRectStyle;
      colorUnreachable: HeatmapRectStyle;
    };
    days: {
      color0: string;
      color1: string;
      color2: string;
      color3: string;
      color4: string;
    };
  }
}

export type ThemeMode = "light" | "dark" | "kak" | "retro";

export const themeModes: Record<ThemeMode, ThemeOptions> = {
  light: lightTheme,
  dark: darkTheme,
  kak: kakTheme,
  retro: retroTheme,
};
