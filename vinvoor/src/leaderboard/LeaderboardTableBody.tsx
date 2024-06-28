import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PodiumBronze, PodiumGold, PodiumSilver } from "mdi-material-ui";
import { FC, useContext } from "react";
import { leaderboardHeadCells, LeaderboardItem } from "../types/leaderboard";
import { UserContext } from "../user/UserProvider";

interface LeaderboardTableBodyProps {
    leaderboardItems: readonly LeaderboardItem[];
}

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
    const {
        userState: { user },
    } = useContext(UserContext);

    return (
        <TableBody>
            {rows.map((row, index) => {
                return (
                    <TableRow
                        key={row.username}
                        id={row.username}
                        sx={{
                            ...(index % 2 === 0 && {
                                backgroundColor: (theme) =>
                                    theme.palette.action.hover,
                            }),
                            ...(row.username === user!.username && {
                                backgroundColor: (theme) =>
                                    alpha(
                                        theme.palette.primary.main,
                                        theme.palette.action.activatedOpacity
                                    ),
                            }),
                        }}
                    >
                        {leaderboardHeadCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.padding}
                            >
                                {headCell.id === "position" ? (
                                    getPosition(row[headCell.id])
                                ) : (
                                    <Typography>{row[headCell.id]}</Typography>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                );
            })}
        </TableBody>
    );
};
