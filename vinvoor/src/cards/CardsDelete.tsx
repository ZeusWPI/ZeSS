import { CancelOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Card } from "../types/cards";

interface CardDeleteProps {
    selected: readonly string[];
    setCards: Dispatch<SetStateAction<readonly Card[]>>;
}

export const CardsDelete: FC<CardDeleteProps> = ({ selected, setCards }) => {
    const [open, setOpen] = useState<boolean>(false);

    const numSelected = selected.length;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const title = `Delete card${numSelected > 1 ? "s" : ""}`;

    const content = `
        Are you sure you want to delete ${numSelected} card${
        numSelected > 1 ? "s" : ""
    }? Unfortunately, this
        feature isn't implemented yet. Again, I'm waiting
        for an endpoint.
        Hannnneeeeeeees...........................
    `;

    const actions = (
        <>
            <Button onClick={handleClose} color="error" variant="contained">
                <CancelOutlined sx={{ mr: 1 }} />
                <Typography>Cancel</Typography>
            </Button>
            <Button color="warning" variant="contained">
                <DeleteIcon sx={{ mr: 1 }} />
                <Typography>Delete</Typography>
            </Button>
        </>
    );

    return (
        <>
            <Tooltip title="Delete">
                <IconButton onClick={handleOpen}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <ConfirmationModal
                open={open}
                onClose={handleClose}
                title={title}
                content={content}
                actions={actions}
            ></ConfirmationModal>
        </>
    );
};
