import { Box, Paper, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { TypographyG } from "../components/TypographyG";
import { CardType } from "../types/Cards";
import { fetchApi } from "../util/fetch";
import { CardAdd } from "./CardAdd";
import { CardTable } from "./CardTable";

export const Cards = () => {
    const [cards, setCards] = useState<readonly CardType[] | undefined>(
        undefined
    );

    useEffect(() => {
        fetchApi("cards").then((data) => setCards(data));
    }, []);

    return (
        <Box>
            {cards === undefined ? (
                <Skeleton variant="rounded" animation="wave" height={250} />
            ) : !!cards.length ? (
                <CardTable cards={cards} setCards={setCards} />
            ) : (
                <Paper
                    elevation={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 2,
                    }}
                >
                    <TypographyG variant="h4">No Registered Cards</TypographyG>
                    <TypographyG variant="body1">
                        You currently have no registered cards. Register your
                        first card to start scanning!
                    </TypographyG>
                    <TypographyG variant="body1">
                        Once you begin registration, you will have one minute to
                        present your card to the scanner (Vinscant). Upon
                        successful registration, your card will be linked to
                        your account and displayed here.
                    </TypographyG>
                    <CardAdd />
                </Paper>
            )}
        </Box>
    );
};
