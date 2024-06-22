import {
    styled,
    TableBody,
    TableCell,
    tableCellClasses,
    TableRow,
    Typography,
} from "@mui/material";
import { PodiumBronze, PodiumGold, PodiumSilver } from "mdi-material-ui";
import { FC } from "react";
import { leaderboardHeadCells, LeaderboardItem } from "../types/leaderboard";

interface LeaderboardTableBodyProps {
    leaderboardItems: readonly LeaderboardItem[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const getPosition = (position: number) => {
    switch (position) {
        case 1:
            return <PodiumGold htmlColor="#FFD700" />;
        case 2:
            return <PodiumSilver htmlColor="#C0C0C0" />;
        case 3:
            return <PodiumBronze htmlColor="#CD7F32" />;
        default:
            return <Typography fontWeight="bold">{position}</Typography>;
    }
};

export const LeaderboardTableBody: FC<LeaderboardTableBodyProps> = ({
    leaderboardItems: rows,
}) => {
    return (
        <TableBody>
            {rows.map((row) => {
                return (
                    <StyledTableRow key={row.username} id={row.username}>
                        {leaderboardHeadCells.map((headCell) => (
                            <StyledTableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.padding}
                            >
                                {headCell.id === "position" ? (
                                    getPosition(row[headCell.id])
                                ) : (
                                    <Typography>{row[headCell.id]}</Typography>
                                )}
                            </StyledTableCell>
                        ))}
                    </StyledTableRow>
                );
            })}
        </TableBody>
    );
};
