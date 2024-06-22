import { GitHub } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { ShakerOutline } from "mdi-material-ui";
import { TypographyG } from "./components/TypographyG";
import { UnstyledLink } from "./components/UnstyledLink";

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        github: true;
    }
}

export const WelcomePage = () => {
    const handleClick = () => {
        window.location.replace("https://github.com/ZeusWPI/ZeSS");
    };

    return (
        <Box
            textAlign="center"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                pt: 10,
            }}
        >
            <TypographyG variant="h3">Welcome to Vinvoor!</TypographyG>
            <TypographyG variant="h4">Log in to start scanning</TypographyG>
            <UnstyledLink to="/login">
                <Button variant="contained">
                    <Typography>Log in with Zauth</Typography>
                    <ShakerOutline sx={{ ml: 1 }} />
                </Button>
            </UnstyledLink>
            <Button
                variant="contained"
                color="github"
                onClick={handleClick}
                sx={{ mt: 3 }}
            >
                <GitHub sx={{ mr: 1 }} />
                <Typography>Github Repository</Typography>
            </Button>
        </Box>
    );
};
