import { Box, Container } from "@mui/material";
import { useContext, useState } from "react";
import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { NavBar } from "./navbar/NavBar";
import { Overview } from "./overview/Overview";
import { UserContext } from "./providers/UserProvider";
import { WelcomePage } from "./WelcomePage";
import { randomInt } from "./util/util";
import "./themes/background.css";

export const App = () => {
  const { user, loading, error } = useContext(UserContext);
  const outlet = useOutlet();

  const [backgroundSix] = useState(() => randomInt(0, 50) === 1);

  return (
    <Box className={backgroundSix ? "Six" : ""}>
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          my: "2%",
        }}
      >
        <LoadingSkeleton isLoading={loading} isError={error !== undefined}>
          {user !== undefined ? (
            outlet !== null ? (
              <Outlet />
            ) : (
              <Overview />
            )
          ) : (
            <>
              <WelcomePage />
              <Navigate to="/" />
            </>
          )}
        </LoadingSkeleton>
      </Container>
    </Box>
  );
};
