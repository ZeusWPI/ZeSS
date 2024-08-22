import { Card, CardJSON, convertCardJSON } from "../../types/cards";
import { createDataContext } from "../DataProvider";

export const { DataProvider: CardsProvider, useDataContext: useCardsContext } =
  createDataContext<readonly Card[], CardJSON[]>("cards", [], convertCardJSON);
