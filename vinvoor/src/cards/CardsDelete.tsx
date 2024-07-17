import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Link, Tooltip, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { FC } from "react";

interface CardDeleteProps {
    selected: readonly string[];
}

export const CardsDelete: FC<CardDeleteProps> = ({ selected }) => {
    const confirm = useConfirm();
    const numSelected = selected.length;

    const title = `Delete card${numSelected > 1 ? "s" : ""}`;
    const content = (
        <Typography>
            ` Are you sure you want to delete ${numSelected} card$
            {numSelected > 1 ? "s" : ""}? Unfortunately, this feature isn't
            available yet. Let's convince Hannes to add this feature by signing
            this <Link href="https://chng.it/nQ6GSXVRMJ">petition!</Link>`
        </Typography>
    );

    const handleClick = () => {
        confirm({
            title: title,
            description: content,
            confirmationText: "Delete",
        }).then(() => console.log("Card deleted!"));
    };

    return (
        <Tooltip title="Delete">
            <IconButton onClick={handleClick}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    );
};
