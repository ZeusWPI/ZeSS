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
    }));

    return (
        <SnackbarProvider
            anchorOrigin={{
                horizontal: "center",
                vertical: "top",
            }}
            Components={{
                success: StyledMaterialDesignContent,
                error: StyledMaterialDesignContent,
            }}
        >
            {children}
        </SnackbarProvider>
    );
};
