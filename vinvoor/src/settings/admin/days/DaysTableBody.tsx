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
import { FC, ReactNode } from "react";
import { Day, daysHeadCells } from "../../../types/days";
import { useDays, useDeleteDay } from "../../../hooks/useDays";

interface DaysTableBodyProps {
  rows: readonly Day[];
  handleSelect: (id: number) => void;
  isSelected: (id: number) => boolean;
  deleting: boolean;
}

export const DaysTableBody: FC<DaysTableBodyProps> = ({
  rows,
  handleSelect,
  isSelected,
  deleting,
}) => {
  const { refetch } = useDays();
  const deleteCard = useDeleteDay();

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (id: number) => {
    if (isSelected(id)) handleSelect(id); // This will remove it from the selected list

    deleteCard.mutate(id, {
      onSuccess: () => {
        enqueueSnackbar("Deleted streakday", { variant: "success" });
        void refetch();
      },
      onError: (error: Error) =>
        enqueueSnackbar(`Failed to delete streakday ${id}: ${error.message}`, {
          variant: "error",
        }),
    });
  };

  return (
    <TableBody>
      {rows.map(day => (
        <TableRow
          key={day.id}
          selected={isSelected(day.id)}
          sx={{
            ...(day.date.getDay() === 1 && {
              backgroundColor: theme => theme.palette.action.hover,
            }),
          }}
        >
          <TableCell padding="checkbox" onClick={() => handleSelect(day.id)}>
            <Checkbox checked={isSelected(day.id)} />
          </TableCell>
          {daysHeadCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.padding}
            >
              <Typography display="inline">
                {headCell.convert
                  ? headCell.convert(day[headCell.id])
                  : (day[headCell.id] as ReactNode)}
              </Typography>
            </TableCell>
          ))}
          <TableCell padding="normal" align="right">
            <IconButton disabled={deleting} onClick={() => handleClick(day.id)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
