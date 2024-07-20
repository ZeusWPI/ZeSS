import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import {
    Card,
    CardGetRegisterResponse,
    CardPostResponse,
    convertCardJSON,
} from "../types/cards";
import { getApi, isResponseNot200Error, postApi } from "../util/fetch";
import { randomInt } from "../util/util";
import { CardContext } from "./Cards";
import {
    CircularTimeProgress,
    CircularTimeProgressProps,
} from "./CircularTimeProgress";

const CHECK_INTERVAL = 1000;
const REGISTER_TIME = 60000;
const REGISTER_ENDPOINT = "cards/register";

const defaultProgressProps: CircularTimeProgressProps = {
    time: REGISTER_TIME,
    percentage: 1,
};

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

export const CardsAdd = () => {
    const { setCards } = useContext(CardContext);
    const [registering, setRegistering] = useState<boolean>(false);
    const [progressProps, setProgressProps] =
        useState<CircularTimeProgressProps>(defaultProgressProps);
    const confirm = useConfirm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const checkCardsChange = async (): Promise<boolean> => {
        let status: CardGetRegisterResponse =
            await getApi<CardGetRegisterResponse>(REGISTER_ENDPOINT);
        while (status.registering && status.isCurrentUser) {
            setProgressProps({
                time: status.timeRemaining,
                percentage: status.timePercentage,
            });
            status = await getApi<CardGetRegisterResponse>(REGISTER_ENDPOINT);
            await new Promise((r) => setTimeout(r, CHECK_INTERVAL));
        }

        return status.success;
    };

    const handleRegister = (start: boolean) => {
        getApi<CardGetRegisterResponse>(REGISTER_ENDPOINT)
            .then(async (response) => {
                let started = false;
                if (!response.registering && start) {
                    await postApi<CardPostResponse>(REGISTER_ENDPOINT)
                        .then(() => (started = true))
                        .catch((error) => {
                            if (isResponseNot200Error(error))
                                error.response
                                    .json()
                                    .then((response: CardPostResponse) => {
                                        if (response.isCurrentUser)
                                            enqueueSnackbar(requestYou, {
                                                variant: "warning",
                                            });
                                        else
                                            enqueueSnackbar(requestOther, {
                                                variant: "error",
                                            });
                                    });
                            else throw new Error(error);
                        });
                }

                if (response.registering && response.isCurrentUser)
                    started = true;

                if (started) {
                    setRegistering(true);
                    const id = randomInt().toString();
                    enqueueSnackbar(requestSuccess, {
                        variant: "info",
                        persist: true,
                        key: id,
                    });

                    checkCardsChange()
                        .then((scanned) => {
                            closeSnackbar(id);
                            setRegistering(false);
                            if (scanned) {
                                enqueueSnackbar(registerSucces, {
                                    variant: "success",
                                });
                                getApi<readonly Card[]>(
                                    "cards",
                                    convertCardJSON
                                ).then((cards) => setCards(cards));
                            } else
                                enqueueSnackbar(registerFail, {
                                    variant: "error",
                                });
                        })
                        .finally(() => setProgressProps(defaultProgressProps));
                }
            })
            .catch(() => enqueueSnackbar(requestFail, { variant: "error" }));
    };

    const handleClick = () => {
        confirm({
            title: confirmTitle,
            description: confirmContent,
            confirmationText: "Register",
        })
            .then(() => handleRegister(true))
            .catch(() => {}); // Required otherwise the confirm dialog will throw an error in the console
    };

    useEffect(() => {
        handleRegister(false);
    }, []);

    return (
        <Button
            onClick={handleClick}
            variant="contained"
            sx={{ my: "1%" }}
            disabled={registering}
        >
            {registering ? (
                <CircularTimeProgress {...progressProps} />
            ) : (
                <Add />
            )}
            <Typography>Register new card</Typography>
        </Button>
    );
};
