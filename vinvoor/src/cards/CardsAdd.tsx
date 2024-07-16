import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { Card, CardPostResponse, convertCardJSON } from "../types/cards";
import { getApi, isResponseNot200Error, postApi } from "../util/fetch";
import { equal, randomInt } from "../util/util";
import { CardContext } from "./Cards";

const CHECK_INTERVAL = 1000;
const REGISTER_TIME = 60000;

const confirmTitle = "Register a new card";
const confirmContent = `
        Once you click 'register' you will have 60 seconds to hold your card to the scanner.
        A popup will appear when the card is registered successfully and it will be added to your cards table.
    `;

const requestSuccess = "Register your card by holding it to vinscant";
const requestYou = "You are already registering a card!";
const requestOther =
    "Failed to start the card registering process because another user is already registering a card. Please try again later.";
const requestFail =
    "Failed to start the card registration process. Please try again later or contact a sysadmin";

const registerSucces = "Card registered successfully";
const registerFail = "Failed to register card";

const getCards = () =>
    getApi<readonly Card[]>("cards", convertCardJSON).catch((_) => null);

const checkCardsChange = async (): Promise<
    [boolean, readonly Card[] | null]
> => {
    const startTime = Date.now();
    const cardsStart = await getCards();

    if (!cardsStart) return [false, null];

    let cardsNow: readonly Card[] | null = null;
    while (Date.now() - startTime < REGISTER_TIME) {
        cardsNow = await getCards();

        if (!equal(cardsStart, cardsNow)) break;

        await new Promise((r) => setTimeout(r, CHECK_INTERVAL));
    }

    return [cardsNow !== null && !equal(cardsNow, cardsStart), cardsNow];
};

export const CardsAdd = () => {
    const { setCards } = useContext(CardContext);
    const [disabled, setDisabled] = useState<boolean>(false);
    const confirm = useConfirm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const startRegistering = () =>
        postApi<Card[]>("cards/register")
            .then(() => {
                const id = randomInt().toString();
                enqueueSnackbar(requestSuccess, {
                    variant: "info",
                    persist: true,
                    key: id,
                });
                setDisabled(true);

                checkCardsChange().then((result) => {
                    closeSnackbar(id);
                    setDisabled(false);

                    if (result[0] && result[1] !== null) {
                        enqueueSnackbar(registerSucces, { variant: "success" });
                        setCards(result[1]);
                    } else enqueueSnackbar(registerFail, { variant: "error" });
                });
            })
            .catch((error) => {
                if (isResponseNot200Error(error)) {
                    error.response.json().then((response: CardPostResponse) => {
                        if (response.isCurrentUser)
                            enqueueSnackbar(requestYou, { variant: "warning" });
                        else
                            enqueueSnackbar(requestOther, { variant: "error" });
                    });
                } else enqueueSnackbar(requestFail, { variant: "error" });
            });

    const handleClick = () => {
        confirm({
            title: confirmTitle,
            description: confirmContent,
            confirmationText: "Register",
        })
            .then(() => startRegistering())
            .catch(() => {}); // Required otherwise the confirm dialog will throw an error in the console
    };

    return (
        <Button
            onClick={handleClick}
            variant="contained"
            sx={{ my: "1%" }}
            disabled={disabled}
        >
            <Add />
            <Typography>Register new card</Typography>
        </Button>
    );
};

// TODO: Make plus sign a spinner when registering
