import { styled, useTheme } from "@mui/material/styles";
import {
  MaterialDesignContent,
  SnackbarProvider,
  SnackbarProviderProps,
} from "notistack";
import { FC } from "react";

export const CustomSnackbarProvider: FC<SnackbarProviderProps> = ({
  children,
}) => {
  const theme = useTheme();

  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-success": {
      backgroundColor: theme.palette.success.main,
    },
    "&.notistack-MuiContent-error": {
      backgroundColor: theme.palette.error.dark,
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: theme.palette.primary.main,
    },
  }));

  return (
    <SnackbarProvider
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};
