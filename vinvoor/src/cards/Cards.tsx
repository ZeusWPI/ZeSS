import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCardsContext } from "../providers/dataproviders/cardsProvider";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

export const Cards = () => {
  const { data: cards, loading } = useCardsContext();

  return (
    <LoadingSkeleton loading={loading}>
      {cards.length ? <CardsTable /> : <CardsEmpty />}
    </LoadingSkeleton>
  );
};
