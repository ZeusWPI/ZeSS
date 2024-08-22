import { Box, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";

export interface CircularTimeProgressProps {
  time: number;
  percentage: number;
}

export const CircularTimeProgress: FC<CircularTimeProgressProps> = ({
  time,
  percentage,
}) => {
  return (
    <Box display="flex" sx={{ alignItems: "center" }}>
      <CircularProgress
        variant="determinate"
        value={percentage * 100}
        size={25}
        sx={{ mr: "5px" }}
      />
      <Typography
        variant="caption"
        component="div"
        color="primary"
        sx={{ position: "absolute", left: 21 }}
      >
        {Math.round(time)}
      </Typography>
    </Box>
  );
};
