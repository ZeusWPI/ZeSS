import type { ChangeEvent } from "react";
import { Paper, Stack, Table, TableContainer } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { TypographyG } from "../../../components/TypographyG";
import {
  useAdminDeleteSeason,
  useAdminSeasons,
} from "../../../hooks/admin/useAdminSeason";
import { randomInt } from "../../../util/util";
import { SeasonsTableBody } from "./SeasonsTableBody";
import { SeasonsTableHead } from "./SeasonsTableHead";

export function SeasonsTable() {
  const { data: seasons, refetch } = useAdminSeasons();
  const deleteSeason = useAdminDeleteSeason();
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (!seasons)
    return null; // Can never happen

  const handleDelete = () => {
    setDeleting(true);
    const key = randomInt();
    enqueueSnackbar("Deleting...", {
      variant: "info",
      key,
      persist: true,
    });

    const promises = selected.map(id =>
      deleteSeason.mutate(id, {
        onError: (error: Error) =>
          enqueueSnackbar(`Failed to delete season ${id}: ${error.message}`, {
            variant: "error",
          }),
      }),
    );

    void Promise.all(promises)
      .then(() => {
        closeSnackbar(key);
        enqueueSnackbar(
          `Deleted ${selected.length} season${selected.length > 1 ? "s" : ""}`,
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
    if (event.target.checked)
      setSelected(seasons.map(season => season.id));
    else setSelected([]);
  };

  const isSelected = (id: number) => selected.includes(id);

  return (
    <Paper elevation={4} sx={{ width: "100%", py: 2 }}>
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <TypographyG variant="h4">Edit Seasons</TypographyG>
        <Paper elevation={6} sx={{ width: "95%", m: 2 }}>
          <TableContainer sx={{ maxHeight: { xs: 400, md: 800 } }}>
            <Table stickyHeader>
              <SeasonsTableHead
                rowCount={seasons.length}
                numSelected={selected.length}
                onSelectAll={handleSelectAll}
                handleDelete={handleDelete}
                deleting={deleting}
              />
              <SeasonsTableBody
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
}
