import {
  Checkbox,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { Optional } from "../../../types/general";
import { useAdminDays } from "../../../hooks/admin/useAdminDays";
import { useAdminSeasons } from "../../../hooks/admin/useAdminSeason";

interface DaysTableToolbarProps {
  dateFilter: [Optional<Date>, Optional<Date>];
  setDateFilter: Dispatch<SetStateAction<[Optional<Date>, Optional<Date>]>>;
  seasonsFilter: Optional<number>;
  setSeasonsFilter: Dispatch<SetStateAction<Optional<number>>>;
  weekdaysFilter: boolean;
  setWeekdaysFilter: Dispatch<SetStateAction<boolean>>;
  weekendsFilter: boolean;
  setWeekendsFilter: Dispatch<SetStateAction<boolean>>;
}

export const DaysTableToolbar: FC<DaysTableToolbarProps> = ({
  dateFilter,
  setDateFilter,
  seasonsFilter: seasonFilter,
  setSeasonsFilter: setSeasonFilter,
  weekdaysFilter,
  setWeekdaysFilter,
  weekendsFilter,
  setWeekendsFilter,
}) => {
  const { data: days } = useAdminDays();
  const { data: seasons } = useAdminSeasons();
  if (!days || !seasons) return null; // Can never happen

  const [startDate, setStartDate] = useState<Dayjs | null>(
    days.length ? dayjs(days[0].date) : dayjs(),
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    days.length ? dayjs(days[days.length - 1].date) : dayjs(),
  );

  const [selectedSeason, setSelectedSeason] =
    useState<Optional<number>>(seasonFilter);

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

  const handleSeasonChange = (event: SelectChangeEvent) =>
    setSelectedSeason(Number(event.target.value));

  const handleClickSeason = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setSeasonFilter(selectedSeason);
    else setSeasonFilter(undefined);
  };

  const handleClickBoolean = (
    event: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<boolean>>,
  ) => setter(event.target.checked);

  return (
    <Stack spacing={1}>
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
        <Checkbox onChange={handleClickSeason} />
        <Typography>Filter season</Typography>
        <Select
          value={String(
            seasons.find(season => season.id === selectedSeason)?.id ??
              seasons[0].id,
          )}
          onChange={handleSeasonChange}
        >
          {seasons.map(season => (
            <MenuItem key={season.id} value={season.id}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
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
