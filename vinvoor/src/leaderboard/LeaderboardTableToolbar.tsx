import { MoveDown } from "@mui/icons-material";
import { Button, Toolbar, Typography } from "@mui/material";
import { HashLink } from "react-router-hash-link";
import { useUser } from "../hooks/useUser";

export function LeaderboardTableToolbar() {
  const { data: user } = useUser();

  return (
    <Toolbar sx={{ p: { xs: 1, sm: 2 }, m: { xs: 1, sm: 2 } }}>
      <Typography sx={{ flex: "1" }} variant="h4" fontWeight="bold">
        Ranking
      </Typography>
      <HashLink to={`/leaderboard#${user!.name}`}>
        <Button variant="contained">
          <MoveDown sx={{ mr: "2%" }} />
          <Typography>Jump</Typography>
        </Button>
      </HashLink>
    </Toolbar>
  );
}
