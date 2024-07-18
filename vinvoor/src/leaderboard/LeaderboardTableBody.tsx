import {
    Icon,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    ArrowDownBoldHexagonOutline,
    ArrowUpBoldHexagonOutline,
    Minus,
} from "mdi-material-ui";
import { FC, useContext } from "react";
import { TableHeadCell } from "../types/general";
import { leaderboardHeadCells, LeaderboardItem } from "../types/leaderboard";
import { UserContext } from "../user/UserProvider";
import FirstPlaceIcon from "/first_place.svg";
import SecondPlaceIcon from "/second_place.svg";
import ThirdPlaceIcon from "/third_place.svg";

interface LeaderboardTableBodyProps {
    leaderboardItems: readonly LeaderboardItem[];
}

const getPositionChange = (positionChange: number) => {
    let icon: JSX.Element | null = null;

    if (positionChange > 0) {
        icon = <ArrowUpBoldHexagonOutline color="success" />;
    } else if (positionChange < 0) {
        icon = <ArrowDownBoldHexagonOutline color="error" />;
    } else {
        icon = <Minus />;
    }

    return (
        <>
            {icon}
            <Typography>{positionChange}</Typography>
        </>
    );
};

const getPosition = (position: number) => {
    switch (position) {
        case 1:
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

const getCell = (
    row: LeaderboardItem,
    headCell: TableHeadCell<LeaderboardItem>
) => {
    switch (headCell.id) {
        case "positionChange":
            return getPositionChange(row[headCell.id]);
        case "position":
            return getPosition(row[headCell.id]);
        default:
            return <Typography>{row[headCell.id]}</Typography>;
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
                                {getCell(row, headCell)}
                            </TableCell>
                        ))}
                    </TableRow>
                );
            })}
        </TableBody>
    );
};
