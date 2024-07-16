import {
    Icon,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FC, useContext } from "react";
import { leaderboardHeadCells, LeaderboardItem } from "../types/leaderboard";
import { UserContext } from "../user/UserProvider";
import FirstPlaceIcon from "/first_place.svg";
import SecondPlaceIcon from "/second_place.svg";
import ThirdPlaceIcon from "/third_place.svg";

interface LeaderboardTableBodyProps {
    leaderboardItems: readonly LeaderboardItem[];
}

const getPosition = (position: number) => {
    switch (position) {
        case 1:
            // return <PodiumGold htmlColor="#FFD700" />;
            return (
                <Icon>
                    <img src={FirstPlaceIcon} />
                </Icon>
            );
        case 2:
            return (
                <Icon>
                    <img src={SecondPlaceIcon} />
                </Icon>
            );
        case 3:
            return (
                <Icon>
                    <img src={ThirdPlaceIcon} />
                </Icon>
            );
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
