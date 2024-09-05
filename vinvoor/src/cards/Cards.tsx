import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCards } from "../hooks/useCard";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

export const Cards = () => {
  const { data: cards, isLoading } = useCards();

  return (
    <LoadingSkeleton loading={isLoading}>
      {cards?.length ? <CardsTable /> : <CardsEmpty />}
    </LoadingSkeleton>
  );
};
