import { TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { leaderboardHeadCells } from "../types/leaderboard";

export const LeaderboardTableHead = () => {
    return (
        <TableHead>
            <TableRow>
                {leaderboardHeadCells.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.align}>
                        <Typography>{headCell.label}</Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
