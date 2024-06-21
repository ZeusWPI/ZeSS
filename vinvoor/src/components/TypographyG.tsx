import { Typography, TypographyProps } from "@mui/material";
import { FC } from "react";

export const TypographyG: FC<TypographyProps> = (props) => {
    return <Typography {...props} gutterBottom />;
};
