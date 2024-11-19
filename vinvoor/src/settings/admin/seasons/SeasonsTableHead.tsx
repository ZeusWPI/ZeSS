import type { ChangeEvent, FC } from "react";
import {
  Box,
  Button,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { seasonsHeadCells } from "../../../types/seasons";

interface SeasonsTableHeadProps {
  rowCount: number;
  numSelected: number;
  onSelectAll: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDelete: () => void;
  deleting: boolean;
}

export const SeasonsTableHead: FC<SeasonsTableHeadProps> = ({
  rowCount,
  numSelected,
  onSelectAll,
  handleDelete,
  deleting,
}) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAll}
          />
        </TableCell>
        {seasonsHeadCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.padding}
          >
            <Typography variant="h6">{headCell.label}</Typography>
          </TableCell>
        ))}
        <TableCell width="auto">
          <Box display="flex" justifyContent="right">
            <Button
              variant="outlined"
              disabled={numSelected === 0 || deleting}
              onClick={handleDelete}
            >
              {`Delet${deleting ? "ing" : "e"} ${numSelected} ${
                deleting ? "..." : ""
              }`}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
