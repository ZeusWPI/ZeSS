import type { FC, ReactNode } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Checkbox,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useAdminDeleteSeason,
  useAdminSeasons,
} from "../../../hooks/admin/useAdminSeason";
import { seasonsHeadCells } from "../../../types/seasons";

interface SeasonsTableBodyProps {
  handleSelect: (id: number) => void;
  isSelected: (id: number) => boolean;
  deleting: boolean;
}

export const SeasonsTableBody: FC<SeasonsTableBodyProps> = ({
  handleSelect,
  isSelected,
  deleting,
}) => {
  const { data: seasons, refetch } = useAdminSeasons();
  const deleteSeason = useAdminDeleteSeason();
  const { enqueueSnackbar } = useSnackbar();

  if (!seasons)
    return null; // Can never happen

  const handleClick = (id: number) => {
    if (isSelected(id))
      handleSelect(id); // This will remove it from the selected list

    deleteSeason.mutate(id, {
      onSuccess: () => {
        enqueueSnackbar("Deleted season", { variant: "success" });
        void refetch();
      },
      onError: (error: Error) =>
        enqueueSnackbar(`Failed to delete season ${id}: ${error.message}`, {
          variant: "error",
        }),
    });
  };

  return (
    <TableBody>
      {seasons.map(season => (
        <TableRow key={season.id} selected={isSelected(season.id)}>
          <TableCell padding="checkbox" onClick={() => handleSelect(season.id)}>
            <Checkbox checked={isSelected(season.id)} />
          </TableCell>
          {seasonsHeadCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.padding}
            >
              <Typography display="inline">
                {headCell.convert
                  ? headCell.convert(season[headCell.id])
                  : (season[headCell.id] as ReactNode)}
              </Typography>
            </TableCell>
          ))}
          <TableCell padding="normal" align="right">
            <IconButton
              disabled={deleting}
              onClick={() => handleClick(season.id)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
