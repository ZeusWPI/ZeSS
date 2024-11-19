import { Paper } from "@mui/material";
import { TypographyG } from "../components/TypographyG";
import { CardsAdd } from "./CardsAdd";

export function CardsEmpty() {
  return (
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
        You currently have no registered cards. Register your first card to
        start scanning!
      </TypographyG>
      <TypographyG variant="body1">
        Once you begin registration, you will have one minute to present your
        card to the scanner (Vinscant). Upon successful registration, your card
        will be linked to your account and displayed here.
      </TypographyG>
      <CardsAdd />
    </Paper>
  );
}
