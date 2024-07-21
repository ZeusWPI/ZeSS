import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { postApi } from "../../util/fetch";

export const Admin: FC = () => {
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

    const { enqueueSnackbar } = useSnackbar();

    const handleDateChange = (
        date: Dayjs | null,
        setter: Dispatch<SetStateAction<Dayjs | null>>
    ) => setter(date);

    const handleOnClick = () => {
        if (!startDate || !endDate) {
            enqueueSnackbar("Please select a start and end date", {
                variant: "error",
            });
            return;
        }

        postApi("admin/days", {
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        })
            .then(() =>
                enqueueSnackbar("successfully saved days", {
                    variant: "success",
                })
            )
            .catch((error) =>
                // This is the admin page so just show the error
                enqueueSnackbar(`Failed to save days: ${error}`, {
                    variant: "error",
                })
            );
    };

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            columnSpacing={4}
            rowSpacing={1}
        >
            <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ p: "10px" }}>
                    <Stack
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        spacing={4}
                    >
                        <Typography variant="h4">Set days</Typography>
                        <Stack direction="row" spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) =>
                                        handleDateChange(newValue, setStartDate)
                                    }
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) =>
                                        handleDateChange(newValue, setEndDate)
                                    }
                                />
                            </LocalizationProvider>
                        </Stack>
                        <Box display="flex" justifyContent="end" width="100%">
                            <Button variant="outlined" onClick={handleOnClick}>
                                Save
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};
