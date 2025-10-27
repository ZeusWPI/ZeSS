import type { FC } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";

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

  useEffect(() => {
    if (isMobileView)
      onMobileView?.();
    else onBrowserView?.();
  }, [isMobileView]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isMobileView)
    return null;

  return isMobileView ? null : children;
};
