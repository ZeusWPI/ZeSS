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
