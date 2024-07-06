import { createContext, Dispatch, SetStateAction, useState } from "react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { Card } from "../types/cards";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

interface CardContextProps {
    cards: readonly Card[];
    setCards: Dispatch<SetStateAction<readonly Card[]>>;
}

export const CardContext = createContext<CardContextProps>({
    cards: [],
    setCards: () => {},
});

export const Cards = () => {
    const [cards, setCards] = useState<readonly Card[]>([]);
    const { loading } = useFetch<readonly Card[]>("cards", setCards);

    return (
        <LoadingSkeleton loading={loading}>
            <CardContext.Provider value={{ cards, setCards }}>
                {!!cards.length ? <CardsTable /> : <CardsEmpty />}
            </CardContext.Provider>
        </LoadingSkeleton>
    );
};
