import { Box, Modal } from "@mui/material";
import { FC, ReactNode } from "react";
import { TypographyG } from "./TypographyG";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: ReactNode;
    actions: ReactNode;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    open,
    onClose,
    title,
    content,
    actions,
}) => {
    return (
        <Modal open={open} onClose={onClose} keepMounted>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 2,
                    }}
                >
                    <TypographyG variant="h4">{title}</TypographyG>
                    <TypographyG variant="body1">{content}</TypographyG>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 6,
                    }}
                >
                    {actions}
                </Box>
            </Box>
        </Modal>
    );
};
