import { Box, Icon, Link } from "@mui/material";
import { TypographyG } from "../components/TypographyG";
import { useVersion } from "../hooks/useVersion";
import FerrisIcon from "/ferris.svg";
import ReactIcon from "/react.svg";
import ZeusIcon from "/zeus.svg";

export function Footer() {
  const { data: version } = useVersion();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TypographyG>
        <Icon sx={{
          pr: "4px",
          pl: "6px",
          alignItems: "center",
          overflow: "visible",
        }}
        >
          <img src={FerrisIcon} />
        </Icon>
        v
        {version?.version ?? ""}
        <Icon sx={{
          pr: "4px",
          pl: "6px",
          alignItems: "center",
          overflow: "visible",
        }}
        >
          <img src={ReactIcon} />
        </Icon>
        v
        {import.meta.env.VITE_APP_VERSION}
      </TypographyG>
      <TypographyG
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Made with ❤️ by
        <Link href="http://zeus.gent">
          <Icon
            sx={{
              pl: "4px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              width: "60px",
            }}
          >
            <img
              src={ZeusIcon}
              alt="Zeus Icon"
              style={{ height: "auto", width: "40px" }}
            />
          </Icon>
        </Link>
      </TypographyG>
      <Link href="https://github.com/ZeusWPI/ZeSS" textAlign="end">
        © 2024
      </Link>
    </Box>
  );
}
