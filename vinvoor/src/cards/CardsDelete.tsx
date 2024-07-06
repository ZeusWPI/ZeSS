import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { FC } from "react";

interface CardDeleteProps {
    selected: readonly string[];
}

export const CardsDelete: FC<CardDeleteProps> = ({ selected }) => {
    const confirm = useConfirm();
    const numSelected = selected.length;

    const title = `Delete card${numSelected > 1 ? "s" : ""}`;
    const content = `
        Are you sure you want to delete ${numSelected} card${
        numSelected > 1 ? "s" : ""
    }? Unfortunately, this
        feature isn't implemented yet. Again, I'm waiting
        for an endpoint.
        Hannnneeeeeeees...........................
    `;

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
