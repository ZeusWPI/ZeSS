import { Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Dispatch, FC, SetStateAction } from "react";
import { CardType } from "../types/Cards";
import { CardAdd } from "./CardAdd";
import { CardDelete } from "./CardDelete";

interface CardTableToolBarProps {
    selected: readonly string[];
    setCards: Dispatch<SetStateAction<readonly CardType[] | undefined>>;
}

export const CardTableToolbar: FC<CardTableToolBarProps> = ({
    selected,
    setCards,
}) => {
    const numSelected = selected.length;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
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
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: "1" }} variant="h6">
                    Cards
                </Typography>
            )}
            {numSelected > 0 ? (
                <CardDelete selected={selected} setCards={setCards} />
            ) : (
                <CardAdd />
            )}
        </Toolbar>
    );
};
