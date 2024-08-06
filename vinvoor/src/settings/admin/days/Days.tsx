import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";
import { useFetch } from "../../../hooks/useFetch";
import { convertDayJSON, Day } from "../../../types/days";
import { getApi } from "../../../util/fetch";
import { DaysAdd } from "./DaysAdd";
import { DaysTable } from "./DaysTable";

interface DayContextProps {
    days: readonly Day[];
    setDays: Dispatch<SetStateAction<readonly Day[]>>;
    reloadDays: () => void;
}

export const DayContext = createContext<DayContextProps>({
    days: [],
    setDays: () => {},
    reloadDays: () => null,
});

export const Days = () => {
    const [days, setDays] = useState<readonly Day[]>([]);
    const { loading } = useFetch<readonly Day[]>(
        "admin/days",
        setDays,
        convertDayJSON
    );

    const { enqueueSnackbar } = useSnackbar();

    const reloadDays = () => {
        getApi<readonly Day[]>("admin/days", convertDayJSON)
            .then((data) => setDays(data))
            // This is the admin page so just show the error
            .catch((error) =>
                enqueueSnackbar(`Error getting all days: ${error}`, {
                    variant: "error",
                })
            );
    };

    return (
        <LoadingSkeleton loading={loading}>
            <DayContext.Provider value={{ days, setDays, reloadDays }}>
                <Grid
                    container
                    justifyContent="space-between"
                    columnSpacing={4}
                    rowSpacing={6}
                >
                    <Grid item xs={12} md={6}>
                        <DaysTable />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DaysAdd />
                    </Grid>
                </Grid>
            </DayContext.Provider>
        </LoadingSkeleton>
    );
};
