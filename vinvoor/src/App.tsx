import { Button, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const App = () => {
    const [name, setName] = useState<string>("");
    const sessionId = Cookies.get("sessionId");

    const login = () => {
        window.location.href = "http://localhost:4000/login";
    };

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        fetch("http://localhost:4000/api/user", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setName(data.Username);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [name]);

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "100vh" }}
        >
            <Typography gutterBottom>Zess Fronted, Coming Soon!</Typography>
            {name ? (
                <Typography variant="h3">{name}</Typography>
            ) : (
                <Button variant="outlined" onClick={login}>
                    Login
                </Button>
            )}
        </Grid>
    );
};
