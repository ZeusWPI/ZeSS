import type { Theme } from "@mui/material/styles";
import type { TableHeadCell } from "../types/general";
import type { LeaderboardItem } from "../types/leaderboard";
import {
  Chip,
  Icon,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useLeaderboardItems } from "../hooks/useLeaderboard";
import { useUser } from "../hooks/useUser";
import { leaderboardHeadCells } from "../types/leaderboard";
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

function getLeaderboardColor(index: number, theme: Theme) {
  return leaderboardColors[index]
    ? { backgroundColor: leaderboardColors[index](theme) }
    : {};
}

const getLeaderboardText = (index: number) => leaderboardText[index] || {};

function getPositionChange(positionChange: number) {
  let color = "text.primary";
  let prefix = "";

  if (positionChange > 0) {
    color = "success.light";
    prefix = "+";
  }
  else if (positionChange < 0) {
    color = "error.light";
  }

  return (
    <Typography color={color} fontWeight="bold">
      {prefix}
      {positionChange !== 0 && positionChange}
    </Typography>
  );
}

function getPosition(position: number) {
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
}

<<<<<<< HEAD
function getScanned(scanned: boolean) {
  if (scanned)
=======
const getScanned = (checkedIn: boolean) => {
  if (checkedIn)
>>>>>>> 6b63abc (vinvoor: small refactor)
    return <Chip label="Checked In" variant="outlined" color="success" />;

  return <></>;
}

function getCell(row: LeaderboardItem, headCell: TableHeadCell<LeaderboardItem>) {
  switch (headCell.id) {
    case "positionChange":
      return getPositionChange(row[headCell.id]);
    case "position":
      return getPosition(row[headCell.id]);
    case "checkedIn":
      return getScanned(row[headCell.id]);
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
}

export function LeaderboardTableBody() {
  const { data: rows } = useLeaderboardItems();
  const theme = useTheme();
  const { data: user } = useUser();

  console.log(rows);

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
}
