import type { ChangeEvent, FC, MouseEvent } from "react";
import type { Card } from "../types/cards";
import { EditOutlined } from "@mui/icons-material";
import {
  Checkbox,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useCards, usePatchCards } from "../hooks/useCard";
import { cardsHeadCells } from "../types/cards";

interface CardsTableBodyProps {
  rows: readonly Card[];
  isRowSelected: (serial: string) => boolean;
  handleClick: (
    event: MouseEvent<HTMLTableCellElement>,
    serial: string,
  ) => void;
  emptyRows: number;
}

const nameSaveSuccess = "New name saved successfully";
const nameSaveFailure = "Unable to save new name";

export const CardsTableBody: FC<CardsTableBodyProps> = ({
  rows,
  isRowSelected,
  handleClick,
  emptyRows,
}) => {
  const { refetch } = useCards();
  const patchCard = usePatchCards();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const handleEditClick = (id: number, name: string) => {
    let newName = name;
    confirm({
      title: "Enter new name",
      content: (
        <TextField
          variant="standard"
          defaultValue={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            (newName = event.target.value)}
        >
        </TextField>
      ),
      confirmationText: "Save",
    })
      .then(() => {
        if (newName === name) {
          enqueueSnackbar(nameSaveSuccess, { variant: "success" });
          return;
        }

        patchCard.mutate(
          { id, newName },
          {
            onSuccess: () => {
              enqueueSnackbar(nameSaveSuccess, {
                variant: "success",
              });
              void refetch();
            },
            onError: () =>
              enqueueSnackbar(nameSaveFailure, { variant: "error" }),
          },
        );
      })
      .catch(() => {
        // Required otherwise the confirm dialog will throw an error in the console
      });
  };

  const editButton = (id: number, name: string) => (
    <IconButton onClick={() => handleEditClick(id, name)}>
      <EditOutlined fontSize="small" />
    </IconButton>
  );

  return (
    <TableBody>
      {rows.map((row) => {
        const isSelected = isRowSelected(row.serial);

        return (
          <TableRow key={row.serial} selected={isSelected}>
            <TableCell
              onClick={event => handleClick(event, row.serial)}
              padding="checkbox"
            >
              <Checkbox checked={isSelected} />
            </TableCell>
            {cardsHeadCells.map(headCell => (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                padding={headCell.padding}
              >
                <Typography display="inline">
                  {headCell.convert
                    ? headCell.convert(row[headCell.id])
                    : (row[headCell.id] as string)}
                </Typography>
                {headCell.id === "name" && editButton(row.id, row[headCell.id])}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
      {emptyRows > 0 && (
        <TableRow
          style={{
            height: 53 * emptyRows,
          }}
        >
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  );
};
