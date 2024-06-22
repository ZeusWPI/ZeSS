import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#ff7f00",
        },
        secondary: {
            main: "#002379",
        },
        github: {
            main: "#FFF4F2",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff7f00",
        },
        secondary: {
            main: "#002379",
        },
        github: {
            main: "#996860",
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ff7f00",
                },
            },
        },
    },
});

declare module "@mui/material/styles" {
    interface Palette {
        github: Palette["primary"];
    }

    interface PaletteOptions {
        github?: PaletteOptions["primary"];
    }
}
