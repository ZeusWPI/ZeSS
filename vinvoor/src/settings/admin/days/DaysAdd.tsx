import { Box, Button, Paper, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { TypographyG } from "../../../components/TypographyG";
import { postApi } from "../../../util/fetch";

interface DaysAddProps {
  reloadDays: Dispatch<SetStateAction<void>>;
}

export const DaysAdd: FC<DaysAddProps> = ({ reloadDays }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const { enqueueSnackbar } = useSnackbar();

  const handleDateChange = (
    date: Dayjs | null,
    setter: Dispatch<SetStateAction<Dayjs | null>>,
  ) => setter(date);

  const handleOnClick = () => {
    if (!startDate || !endDate) {
      enqueueSnackbar("Please select a start and end date", {
        variant: "error",
      });
      return;
    }

    postApi("admin/days", {
      start_date: startDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      end_date: endDate.format("YYYY-MM-DDTHH:mm:ssZ"),
    })
      .then(() => {
        enqueueSnackbar("successfully saved days", {
          variant: "success",
        });
        reloadDays();
      })
      .catch(error =>
        // This is the admin page so just show the error
        enqueueSnackbar(`Failed to save days: ${error}`, {
          variant: "error",
        }),
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
        <TypographyG variant="h4">Add days</TypographyG>
        <Stack direction="row" spacing={2} paddingX={{ xs: 1, md: 0 }}>
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
};
