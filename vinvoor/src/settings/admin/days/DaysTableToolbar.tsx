import { Checkbox, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { Optional } from "../../../types/general";
import { useAdminDays } from "../../../hooks/admin/useAdminDays";

interface DaysTableToolbarProps {
  dateFilter: [Optional<Date>, Optional<Date>];
  setDateFilter: Dispatch<SetStateAction<[Optional<Date>, Optional<Date>]>>;
  weekdaysFilter: boolean;
  setWeekdaysFilter: Dispatch<SetStateAction<boolean>>;
  weekendsFilter: boolean;
  setWeekendsFilter: Dispatch<SetStateAction<boolean>>;
}

export const DaysTableToolbar: FC<DaysTableToolbarProps> = ({
  dateFilter,
  setDateFilter,
  weekdaysFilter,
  setWeekdaysFilter,
  weekendsFilter,
  setWeekendsFilter,
}) => {
  const { data: days } = useAdminDays();
  if (!days) return null; // Can never happen

  const [startDate, setStartDate] = useState<Dayjs | null>(
    days.length ? dayjs(days[0].date) : dayjs(),
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    days.length ? dayjs(days[days.length - 1].date) : dayjs(),
  );

  const handleDateChange = (
    date: Dayjs | null,
    setter: Dispatch<SetStateAction<Dayjs | null>>,
    index: number,
  ) => {
    setter(date);

    if (dateFilter[0] !== undefined && dateFilter[1] !== undefined) {
      const newDateFilter = [...dateFilter];
      newDateFilter[index] = date?.toDate();
      setDateFilter(newDateFilter as [Optional<Date>, Optional<Date>]);
    }
  };

  const handleClickDate = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked)
      setDateFilter([startDate?.toDate(), endDate?.toDate()]);
    else setDateFilter([undefined, undefined]);
  };

  const handleClickBoolean = (
    event: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<boolean>>,
  ) => setter(event.target.checked);

  return (
    <Stack>
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={2}
        paddingX={{ xs: 1, md: 0 }}
      >
        <Checkbox onChange={handleClickDate} />
        <Typography>Filter date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={newValue => handleDateChange(newValue, setStartDate, 0)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={newValue => handleDateChange(newValue, setEndDate, 1)}
          />
        </LocalizationProvider>
      </Stack>
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={2}
        paddingX={{ xs: 1, md: 0 }}
      >
        <Checkbox
          checked={weekdaysFilter}
          onChange={event => handleClickBoolean(event, setWeekdaysFilter)}
        />
        <Typography>Only weekdays</Typography>
      </Stack>
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={2}
        paddingX={{ xs: 1, md: 0 }}
      >
        <Checkbox
          checked={weekendsFilter}
          onChange={event => handleClickBoolean(event, setWeekendsFilter)}
        />
        <Typography>Only weekends</Typography>
      </Stack>
    </Stack>
  );
};
