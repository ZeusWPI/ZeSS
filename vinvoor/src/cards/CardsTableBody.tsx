import {
    Checkbox,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { FC, MouseEvent } from "react";
import { Card, CardsHeadCells } from "../types/cards";

interface CardsTableBodyProps {
    rows: readonly Card[];
    isRowSelected: (serial: string) => boolean;
    handleClick: (
        event: MouseEvent<HTMLTableRowElement>,
        serial: string
    ) => void;
    emptyRows: number;
}

export const CardsTableBody: FC<CardsTableBodyProps> = ({
    rows,
    isRowSelected,
    handleClick,
    emptyRows,
}) => {
    return (
        <TableBody>
            {rows.map((row) => {
                const isSelected = isRowSelected(row.serial);

                return (
                    <TableRow
                        key={row.serial}
                        selected={isSelected}
                        onClick={(event) => handleClick(event, row.serial)}
                        sx={{ cursor: "pointer" }}
                    >
                        <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} />
                        </TableCell>
                        {CardsHeadCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.padding}
                            >
                                <Typography>{row[headCell.id]}</Typography>
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
