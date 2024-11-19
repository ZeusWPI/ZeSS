import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useCards } from "../hooks/useCard";
import { CardsEmpty } from "./CardsEmpty";
import { CardsTable } from "./CardsTable";

export function Cards() {
  const cardsQuery = useCards();

  return (
    <LoadingSkeleton queries={[cardsQuery]}>
      {cardsQuery.data?.length ? <CardsTable /> : <CardsEmpty />}
    </LoadingSkeleton>
  );
}
