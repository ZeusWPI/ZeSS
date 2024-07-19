import { useMediaQuery, useTheme } from "@mui/material";
import { FC } from "react";

interface BrowserViewProps {
    children: React.ReactNode;
}

export const BrowserView: FC<BrowserViewProps> = ({ children }) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

    return isMobileView ? null : <>{children}</>;
};
