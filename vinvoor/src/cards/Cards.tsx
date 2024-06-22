import { useState } from "react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { Card } from "../types/cards";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

export const Cards = () => {
    const [cards, setCards] = useState<readonly Card[]>([]);
    const { loading, error: _ } = useFetch<readonly Card[]>("cards", setCards);

    return (
        <LoadingSkeleton loading={loading}>
            {!!cards.length ? (
                <CardsTable cards={cards} setCards={setCards} />
            ) : (
                <CardsEmpty />
            )}
        </LoadingSkeleton>
    );
};
