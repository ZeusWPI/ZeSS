import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { NavBar } from "./navbar/NavBar";
import { Overview } from "./overview/Overview";
import { WelcomePage } from "./WelcomePage";
import { randomInt } from "./util/util";
import "./themes/background.css";
import { useUser } from "./hooks/useUser";

export const App = () => {
  const userQuery = useUser();
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
        <LoadingSkeleton queries={[userQuery]}>
          {Object.keys(userQuery.data ?? {}).length > 0 ? (
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
