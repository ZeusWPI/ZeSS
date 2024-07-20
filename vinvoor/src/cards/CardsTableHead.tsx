import {
    Checkbox,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";
import { ChangeEvent, FC, MouseEvent } from "react";
import { Card, cardsHeadCells } from "../types/cards";
import { TableOrder } from "../types/general";

interface CardTableHeadProps {
    numSelected: number;
    onRequestSort: (
        event: MouseEvent<HTMLButtonElement>,
        property: keyof Card
    ) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: TableOrder;
    orderBy: string;
    rowCount: number;
}

export const CardsTableHead: FC<CardTableHeadProps> = ({
    numSelected,
    onRequestSort,
    onSelectAllClick,
    order,
    orderBy,
    rowCount,
}) => {
    const createSortHandler =
        (property: keyof Card) => (event: MouseEvent<HTMLButtonElement>) =>
            onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {cardsHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.padding}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <Typography>{headCell.label}</Typography>
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
