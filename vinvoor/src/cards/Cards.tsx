import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCards } from "../hooks/useCard";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

export const Cards = () => {
  const { data: cards, isLoading, isError } = useCards();

  return (
    <LoadingSkeleton isLoading={isLoading} isError={isError}>
      {cards?.length ? <CardsTable /> : <CardsEmpty />}
    </LoadingSkeleton>
  );
};
