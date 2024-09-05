import { Paper, Stack, Table, TableContainer } from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, useEffect, useState } from "react";
import { TypographyG } from "../../../components/TypographyG";
import { Day } from "../../../types/days";
import { Optional } from "../../../types/general";
import { randomInt } from "../../../util/util";
import { DaysTableBody } from "./DaysTableBody";
import { DaysTableHead } from "./DaysTableHead";
import { DaysTableToolbar } from "./DaysTableToolbar";
import { useDays, useDeleteDay } from "../../../hooks/useDays";

export const DaysTable = () => {
  const { data: days, refetch } = useDays();
  if (!days) return null; // Can never happen

  const deleteDay = useDeleteDay();
  const [rows, setRows] = useState<readonly Day[]>(days);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [dateFilter, setDateFilter] = useState<
    [Optional<Date>, Optional<Date>]
  >([undefined, undefined]);
  const [weekdaysFilter, setWeekdaysFilter] = useState<boolean>(false);
  const [weekendsFilter, setWeekendsFilter] = useState<boolean>(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const filterDays = (): readonly Day[] => {
    let filteredDays = [...days];
    if (dateFilter[0] !== undefined && dateFilter[1] !== undefined) {
      filteredDays = filteredDays.filter(
        day =>
          day.date.getTime() >= dateFilter[0]!.getTime() &&
          day.date.getTime() <= dateFilter[1]!.getTime(),
      );
    }
    if (weekdaysFilter) {
      filteredDays = filteredDays.filter(
        day => day.date.getDay() !== 0 && day.date.getDay() !== 6,
      );
    }
    if (weekendsFilter) {
      filteredDays = filteredDays.filter(
        day => day.date.getDay() === 0 || day.date.getDay() === 6,
      );
    }

    return filteredDays;
  };

  const handleDelete = () => {
    setDeleting(true);
    const key = randomInt();
    enqueueSnackbar("Deleting...", {
      variant: "info",
      key: key,
      persist: true,
    });

    const promises = selected.map(id =>
      deleteDay.mutate(id, {
        onError: (error: Error) =>
          enqueueSnackbar(
            `Failed to delete streakday ${id}: ${error.message}`,
            {
              variant: "error",
            },
          ),
      }),
    );

    void Promise.all(promises)
      .then(() => {
        closeSnackbar(key);
        enqueueSnackbar(
          `Deleted ${selected.length} streakday${selected.length > 1 ? "s" : ""}`,
          {
            variant: "success",
          },
        );

        setSelected([]);
        setDeleting(false);
      })
      .finally(() => void refetch());
  };

  const handleSelect = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    switch (selectedIndex) {
      case -1:
        newSelected = newSelected.concat(selected, id);
        break;
      case 0:
        newSelected = newSelected.concat(selected.slice(1));
        break;
      case selected.length - 1:
        newSelected = newSelected.concat(selected.slice(0, -1));
        break;
      default:
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
    }

    setSelected(newSelected);
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setSelected(rows.map(day => day.id));
    else setSelected([]);
  };

  const isSelected = (id: number) => selected.includes(id);

  useEffect(
    () => setRows(filterDays()),
    [days, dateFilter, weekdaysFilter, weekendsFilter],
  );

  return (
    <Paper elevation={4} sx={{ width: "100%", py: 2 }}>
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <TypographyG variant="h4">Edit Days</TypographyG>
        <DaysTableToolbar
          {...{
            dateFilter,
            setDateFilter,
            weekdaysFilter,
            setWeekdaysFilter,
            weekendsFilter,
            setWeekendsFilter,
          }}
        />
        <Paper elevation={6} sx={{ width: "95%", m: 2 }}>
          <TableContainer sx={{ maxHeight: { xs: 400, md: 800 } }}>
            <Table stickyHeader>
              <DaysTableHead
                rowCount={days.length}
                numSelected={selected.length}
                onSelectAll={handleSelectAll}
                handleDelete={handleDelete}
                deleting={deleting}
              />
              <DaysTableBody
                rows={rows}
                handleSelect={handleSelect}
                isSelected={isSelected}
                deleting={deleting}
              />
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Paper>
  );
};
