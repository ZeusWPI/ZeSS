import type { TypographyProps } from "@mui/material";
import type { FC } from "react";
import { Typography } from "@mui/material";

export const TypographyG: FC<TypographyProps> = (props) => {
  return <Typography {...props} gutterBottom />;
};
