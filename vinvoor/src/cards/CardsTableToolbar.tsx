import { Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Dispatch, FC, SetStateAction } from "react";
import { Card } from "../types/cards";
import { CardsAdd } from "./CardsAdd";
import { CardsDelete } from "./CardsDelete";

interface CardTableToolbarProps {
    selected: readonly string[];
    setCards: Dispatch<SetStateAction<readonly Card[]>>;
}

export const CardsTableToolbar: FC<CardTableToolbarProps> = ({
    selected,
    setCards,
}) => {
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
                    <CardsDelete selected={selected} setCards={setCards} />
                </>
            ) : (
                <>
                    <Typography sx={{ flex: "1" }} variant="h6">
                        Cards
                    </Typography>
                    <CardsAdd />
                </>
            )}
        </Toolbar>
    );
};
