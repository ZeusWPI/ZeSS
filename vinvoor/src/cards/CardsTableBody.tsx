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
import { ChangeEvent, FC, MouseEvent } from "react";
import { useCardsContext } from "../providers/dataproviders/cardsProvider";
import {
  Card,
  CardJSON,
  cardsHeadCells,
  convertCardJSON,
} from "../types/cards";
import { getApi, patchApi } from "../util/fetch";

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
  const { setData: setCards } = useCardsContext();
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
            (newName = event.target.value)
          }
        ></TextField>
      ),
      confirmationText: "Save",
    })
      .then(() => {
        if (newName === name) {
          enqueueSnackbar(nameSaveSuccess, { variant: "success" });
          return;
        }

        patchApi(`cards/${id}`, { name: newName })
          .then(() => {
            enqueueSnackbar(nameSaveSuccess, {
              variant: "success",
            });
            void getApi<readonly Card[], CardJSON[]>(
              "cards",
              convertCardJSON,
            ).then(cards => setCards(cards));
          })
          .catch(() => enqueueSnackbar(nameSaveFailure, { variant: "error" }));
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
      {rows.map(row => {
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
