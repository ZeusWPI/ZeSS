import { Box, Typography } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import CursesSob from "/cursed_sob.png";

function get_error(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }
  else if (error instanceof Error) {
    return error.message;
  }
  else if (typeof error === "string") {
    return error;
  }
  else {
    console.error(error);
    return "Unknown error";
  }
}

export function ErrorPage() {
  const error = useRouteError();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "85vh",
        textAlign: "center",
        cursor: `url(${CursesSob}), pointer`,
      }}
    >
      <Typography variant="h1" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {get_error(error)}
      </Typography>
    </Box>
  );
}
