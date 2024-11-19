import type { Dayjs } from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import { Box, Button, Paper, Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { TypographyG } from "../../../components/TypographyG";
import {
  useAdminAddSeason,
  useAdminSeasons,
} from "../../../hooks/admin/useAdminSeason";

export function SeasonsAdd() {
  const { refetch } = useAdminSeasons();
  const addSeason = useAdminAddSeason();
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [name, setName] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();

  const handleDateChange = (
    date: Dayjs | null,
    setter: Dispatch<SetStateAction<Dayjs | null>>,
  ) => setter(date);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleOnClick = () => {
    if (!startDate || !endDate) {
      enqueueSnackbar("Please select a start and end date", {
        variant: "error",
      });
      return;
    }

    addSeason.mutate(
      { name, startDate, endDate },
      {
        onSuccess: () => {
          enqueueSnackbar("successfully saved season", {
            variant: "success",
          });
          void refetch();
        },
        onError: error =>
          // This is the admin page so just show the error
          enqueueSnackbar(`Failed to save seasib: ${error.message}`, {
            variant: "error",
          }),
      },
    );
  };

  return (
    <Paper elevation={4} sx={{ py: 2 }}>
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <TypographyG variant="h4">Add Season</TypographyG>
        <Stack direction="row" spacing={2} paddingX={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={newValue => handleDateChange(newValue, setStartDate)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={newValue => handleDateChange(newValue, setEndDate)}
            />
          </LocalizationProvider>
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            variant="outlined"
          />
        </Stack>
        <Box
          display="flex"
          justifyContent="end"
          width="100%"
          sx={{ pr: { xs: 1, md: 2 } }}
        >
          <Button variant="outlined" onClick={handleOnClick}>
            Add
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
