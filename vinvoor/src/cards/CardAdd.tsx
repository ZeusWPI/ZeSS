import { Add, CancelOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { ConfirmationModal } from "../components/ConfirmationModal";

export const CardAdd = () => {
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const title = "Register a new card";

    const content = `
        This feature is not yet implemented as I'm waiting for an endpoint.
        Hannes................................................
    `;

    const actions = (
        <>
            <Button onClick={handleClose} color="error" variant="contained">
                <CancelOutlined sx={{ mr: 1 }} />
                <Typography>Cancel</Typography>
            </Button>
            <Button color="success" variant="contained">
                <Add sx={{ mr: 1 }} />
                <Typography>Register</Typography>
            </Button>
        </>
    );

    return (
        <>
            <Button onClick={handleOpen} variant="contained" sx={{ my: "1%" }}>
                <Add />
                <Typography>Register new card</Typography>
            </Button>
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
