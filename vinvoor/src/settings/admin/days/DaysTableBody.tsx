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
import { FC, ReactNode, useContext } from "react";
import { Day, daysHeadCells } from "../../../types/days";
import { deleteAPI } from "../../../util/fetch";
import { DayContext } from "./Days";

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
    const { days, setDays } = useContext(DayContext);

    const { enqueueSnackbar } = useSnackbar();

    const handleClick = (id: number) => {
        if (isSelected(id)) handleSelect(id); // This will remove it from the selected list

        deleteAPI(`admin/days/${id}`)
            .then(() => {
                enqueueSnackbar("Deleted streakday", { variant: "success" });
                setDays([...days].filter((day) => day.id !== id));
            })
            .catch((error) =>
                // This is the admin page so just show the error
                enqueueSnackbar(`Failed to delete streakday: ${error}`, {
                    variant: "error",
                })
            );
    };

    return (
        <TableBody>
            {rows.map((day) => (
                <TableRow key={day.id} selected={isSelected(day.id)}>
                    <TableCell
                        padding="checkbox"
                        onClick={() => handleSelect(day.id)}
                    >
                        <Checkbox checked={isSelected(day.id)} />
                    </TableCell>
                    {daysHeadCells.map((headCell) => (
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
                        <IconButton
                            disabled={deleting}
                            onClick={() => handleClick(day.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};
