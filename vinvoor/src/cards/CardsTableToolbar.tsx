import { Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FC } from "react";
import { CardsAdd } from "./CardsAdd";
import { CardsDelete } from "./CardsDelete";

interface CardTableToolbarProps {
    selected: readonly string[];
}

export const CardsTableToolbar: FC<CardTableToolbarProps> = ({ selected }) => {
    const numSelected = selected.length;

    return (
        <Toolbar
            sx={{
                px: { xs: 1, sm: 2 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <>
                    <Typography
                        sx={{ flex: "1" }}
                        variant="subtitle1"
                        fontWeight="medium"
                    >
                        {numSelected} selected
                    </Typography>
                    <CardsDelete selected={selected} />
                </>
            ) : (
                <>
                    <Typography
                        sx={{ flex: "1" }}
                        variant="h5"
                        fontWeight="bold"
                    >
                        Cards
                    </Typography>
                    <CardsAdd />
                </>
            )}
        </Toolbar>
    );
};
