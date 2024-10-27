import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Navigate, Outlet, useOutlet } from "react-router-dom";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { Footer } from "./footer/Footer";
import { useUser } from "./hooks/useUser";
import { NavBar } from "./navbar/NavBar";
import { Overview } from "./overview/Overview";
import "./themes/background.css";
import { randomInt } from "./util/util";
import { WelcomePage } from "./WelcomePage";

export const App = () => {
  const userQuery = useUser();
  const outlet = useOutlet();

  const [backgroundSix] = useState(() => randomInt(0, 50) === 1);

  return (
    <Box
      className={backgroundSix ? "Six" : ""}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
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
      <Container maxWidth="xl">
        <Footer />
      </Container>
    </Box>
  );
};
