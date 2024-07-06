import { Container } from "@mui/material";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { NavBar } from "./navbar/NavBar";
import { UserContext } from "./user/UserProvider";
import { WelcomePage } from "./WelcomePage";

export const App = () => {
    const {
        userState: { user, loading },
    } = useContext(UserContext);

    return (
        <>
            <NavBar />
            <Container maxWidth="xl" sx={{ my: "2%" }}>
                <LoadingSkeleton loading={loading}>
                    {user !== undefined ? (
                        <Outlet />
                    ) : (
                        <>
                            <WelcomePage />
                            <Navigate to="/" />
                        </>
                    )}
                </LoadingSkeleton>
            </Container>
        </>
    );
};
