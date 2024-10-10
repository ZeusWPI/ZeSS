import {
  Icon,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, Theme, useTheme } from "@mui/material/styles";
import { useLeaderboardItems } from "../hooks/useLeaderboard";
import { useUser } from "../hooks/useUser";
import { TableHeadCell } from "../types/general";
import { leaderboardHeadCells, LeaderboardItem } from "../types/leaderboard";
import FirstPlaceIcon from "/first_place.svg";
import SecondPlaceIcon from "/second_place.svg";
import ThirdPlaceIcon from "/third_place.svg";

const leaderboardColors = [
  (theme: Theme) => theme.leaderboard.first,
  (theme: Theme) => theme.leaderboard.second,
  (theme: Theme) => theme.leaderboard.third,
];

const leaderboardText = [
  { fontSize: "30px", fontWeight: "bold" },
  { fontSize: "24px", fontWeight: "bold" },
  { fontSize: "18px", fontWeight: "bold" },
];

const getLeaderboardColor = (index: number, theme: Theme) =>
  leaderboardColors[index]
    ? { backgroundColor: leaderboardColors[index](theme) }
    : {};

const getLeaderboardText = (index: number) => leaderboardText[index] || {};

const getPositionChange = (positionChange: number) => {
  let color = "text.primary";
  let prefix = "";

  if (positionChange > 0) {
    color = "success.light";
    prefix = "+";
  } else if (positionChange < 0) {
    color = "error.light";
  }

  return (
    <Typography color={color} fontWeight="bold">
      {prefix}
      {positionChange !== 0 && positionChange}
    </Typography>
  );
};

const getPosition = (position: number) => {
  switch (position) {
    case 1:
      return (
        <Icon sx={{ fontSize: "40px", overflow: "visible" }}>
          <img src={FirstPlaceIcon} />
        </Icon>
      );
    case 2:
      return (
        <Icon sx={{ fontSize: "35px", overflow: "visible" }}>
          <img src={SecondPlaceIcon} />
        </Icon>
      );
    case 3:
      return (
        <Icon sx={{ fontSize: "30px", overflow: "visible" }}>
          <img src={ThirdPlaceIcon} />
        </Icon>
      );
    default:
      return <Typography fontWeight="bold">{position}</Typography>;
  }
};

const getCell = (
  row: LeaderboardItem,
  headCell: TableHeadCell<LeaderboardItem>,
) => {
  switch (headCell.id) {
    case "positionChange":
      return getPositionChange(row[headCell.id]);
    case "position":
      return getPosition(row[headCell.id]);
    default:
      return (
        <Typography
          sx={{
            ...getLeaderboardText(row.position - 1),
          }}
        >
          {row[headCell.id]}
        </Typography>
      );
  }
};

export const LeaderboardTableBody = () => {
  const { data: rows } = useLeaderboardItems();
  if (!rows) return null; // Can never happen

  const theme = useTheme();
  const { data: user } = useUser();

  return (
    <TableBody>
      {rows.map((row, index) => {
        return (
          <TableRow
            key={row.name}
            id={row.name}
            sx={{
              ...(index % 2 === 0 && {
                backgroundColor: theme => theme.palette.action.hover,
              }),
              ...(row.name === user!.name && {
                backgroundColor: theme =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity,
                  ),
              }),
              ...getLeaderboardColor(row.position - 1, theme),
            }}
          >
            {leaderboardHeadCells.map(headCell => (
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
