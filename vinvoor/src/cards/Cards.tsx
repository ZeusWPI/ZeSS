import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CardType } from "../types/Cards";
import { fetchApi } from "../util/fetch";

export const Cards = () => {
    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        fetchApi("cards").then((data) => {
            setCards(data);
        });
    }, []);

    return (
        <Grid container spacing={2}>
            {cards.map((card) => (
                <Grid item key={card.serial} xs={2}>
                    <Paper elevation={4} sx={{ textAlign: "center" }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {card.serial}
                                </Typography>
                                <Typography variant="body2">
                                    {card.created_at}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    onClick={() => {}}
                                    sx={{ marginLeft: "auto" }}
                                >
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};
