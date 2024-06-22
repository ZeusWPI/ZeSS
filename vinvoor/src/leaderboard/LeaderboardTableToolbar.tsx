import { MoveDown } from "@mui/icons-material";
import { Button, Toolbar, Typography } from "@mui/material";
import { FC, useContext } from "react";
import { HashLink } from "react-router-hash-link";
import { UserContext } from "../user/UserProvider";

interface LeaderboardTableToolbarProps {}

export const LeaderboardTableToolbar: FC<
    LeaderboardTableToolbarProps
> = ({}) => {
    const { user } = useContext(UserContext);

    return (
        <Toolbar sx={{ p: { xs: 1, sm: 2 }, m: { xs: 1, sm: 2 } }}>
            <Typography sx={{ flex: "1" }} variant="h4" fontWeight="bold">
                Ranking
            </Typography>
            <HashLink to={`/leaderboard#${user!.username}`}>
                <Button variant="contained">
                    <MoveDown sx={{ mr: "2%" }} />
                    <Typography>Jump</Typography>
                </Button>
            </HashLink>
        </Toolbar>
    );
};
