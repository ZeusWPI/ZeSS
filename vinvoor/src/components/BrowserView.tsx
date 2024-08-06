import { useMediaQuery, useTheme } from "@mui/material";
import { FC, useEffect } from "react";

interface BrowserViewProps {
    onMobileView?: () => void;
    onBrowserView?: () => void;
    children: React.ReactNode;
}

export const BrowserView: FC<BrowserViewProps> = ({
    onMobileView,
    onBrowserView,
    children,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

    // Only run callbacks after the component has rendered
    useEffect(() => {
        if (isMobileView) onMobileView?.();
        else onBrowserView?.();
    }, [isMobileView]);

    return isMobileView ? null : <>{children}</>;
};
