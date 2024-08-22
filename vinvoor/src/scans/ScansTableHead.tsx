import { TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { scanCardHeadCells } from "../types/scans";

export const ScansTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        {scanCardHeadCells.map(headCell => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Typography variant="h6">{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
