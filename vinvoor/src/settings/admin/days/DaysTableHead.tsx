import {
    Box,
    Button,
    Checkbox,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { ChangeEvent, FC } from "react";
import { daysHeadCells } from "../../../types/days";

interface DaysTableHeadProps {
    rowCount: number;
    numSelected: number;
    onSelectAll: (event: ChangeEvent<HTMLInputElement>) => void;
    handleDelete: () => void;
    deleting: boolean;
}

export const DaysTableHead: FC<DaysTableHeadProps> = ({
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
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAll}
                    />
                </TableCell>
                {daysHeadCells.map((headCell) => (
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
                        >{`Delet${deleting ? "ing" : "e"} ${numSelected} ${
                            deleting ? "..." : ""
                        }`}</Button>
                    </Box>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};
