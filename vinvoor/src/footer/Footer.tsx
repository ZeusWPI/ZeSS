import { Box, Icon, Link, Tooltip } from "@mui/material";
import { TypographyG } from "../components/TypographyG";
import { useVersion } from "../hooks/useVersion";
import FerrisIcon from "/ferris.svg";
import ReactIcon from "/react.svg";
import ZeusIcon from "/zeus.svg";
import useWindowDimensions from "../hooks/useWindowSize";

export function Footer() {
  const { data: version } = useVersion();
  const { width } = useWindowDimensions()

  const small = width < 450

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {!small && (
        <TypographyG sx={{ display: "flex" }}>
          <Tooltip title="Backend version" arrow>
            <Link href="https://github.com/ZeusWPI/ZeSS/tree/main/vingo" style={{ color: "inherit" }} underline="hover">
              <Icon sx={{
                pr: "4px",
                pl: "5px",
                alignItems: "center",
                overflow: "visible",
              }}
              >
                <img src={FerrisIcon} />
              </Icon>
              v
              {version?.version ?? ""}
            </Link>
          </Tooltip>
          <Tooltip title="Frontend version" arrow>
            <Link href="https://github.com/ZeusWPI/ZeSS/tree/main/vinvoor" style={{ color: "inherit" }} underline="hover">
              <Icon sx={{
                pr: "4px",
                pl: "5px",
                alignItems: "center",
                overflow: "visible",
              }}
              >
                <img src={ReactIcon} />
              </Icon>
              v
              {/* @ts-expect-error vite variable */}
              {__APP_VERSION__}
            </Link>
          </Tooltip>
        </TypographyG>
      )}
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
      {!small && (
        <Link href="https://github.com/ZeusWPI/ZeSS" textAlign="end">
          {`© ${(new Date()).getFullYear()}`}
        </Link>
      )}
    </Box>
  );
}
