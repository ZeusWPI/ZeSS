import { Paper, Stack, Table, TableContainer } from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TypographyG } from "../../../components/TypographyG";
import { Day } from "../../../types/days";
import { deleteAPI } from "../../../util/fetch";
import { randomInt } from "../../../util/util";
import { DayContext } from "./Days";
import { DaysTableBody } from "./DaysTableBody";
import { DaysTableHead } from "./DaysTableHead";
import { DaysTableToolbar } from "./DaysTableToolbar";

export const DaysTable = () => {
    const { days, reloadDays } = useContext(DayContext);
    const [rows, setRows] = useState<readonly Day[]>(days);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [deleting, setDeleting] = useState<boolean>(false);

    const [dateFilter, setDateFilter] = useState<
        [Date | undefined, Date | undefined]
    >([undefined, undefined]);
    const [weekdaysFilter, setWeekdaysFilter] = useState<boolean>(false);
    const [weekendsFilter, setWeekendsFilter] = useState<boolean>(false);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const filterDays = (): readonly Day[] => {
        let filteredDays = [...days];
        if (dateFilter[0] !== undefined && dateFilter[1] !== undefined) {
            filteredDays = filteredDays.filter(
                (day) =>
                    day.date.getTime() >= dateFilter[0]!.getTime() &&
                    day.date.getTime() <= dateFilter[1]!.getTime()
            );
        }
        if (weekdaysFilter) {
            filteredDays = filteredDays.filter(
                (day) => day.date.getDay() !== 0 && day.date.getDay() !== 6
            );
        }
        if (weekendsFilter) {
            filteredDays = filteredDays.filter(
                (day) => day.date.getDay() === 0 || day.date.getDay() === 6
            );
        }

        return filteredDays;
    };

    const handleDelete = async () => {
        setDeleting(true);
        const key = randomInt();
        enqueueSnackbar("Deleting...", {
            variant: "info",
            key: key,
            persist: true,
        });

        const promises = selected.map((id) =>
            deleteAPI(`admin/days/${id}`).catch((error) =>
                // This is the admin page so just show the error
                enqueueSnackbar(`Failed to delete streakday ${id}: ${error}`, {
                    variant: "error",
                })
            )
        );

        await Promise.all(promises);

        closeSnackbar(key);
        enqueueSnackbar(
            `Deleted ${selected.length} streakday${
                selected.length > 1 ? "s" : ""
            }`,
            {
                variant: "success",
            }
        );

        setSelected([]);
        setDeleting(false);
        reloadDays();
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
                    selected.slice(selectedIndex + 1)
                );
        }

        setSelected(newSelected);
    };
    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) setSelected(rows.map((day) => day.id));
        else setSelected([]);
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    useEffect(
        () => setRows(filterDays()),
        [days, dateFilter, weekdaysFilter, weekendsFilter]
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
