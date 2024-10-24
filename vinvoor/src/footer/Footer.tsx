import { Box, Container, Icon, Link } from "@mui/material";
import { TypographyG } from "../components/TypographyG";
import { useVersion } from "../hooks/useVersion";
import ZeusIcon from "/zeus.svg";

export const Footer = () => {
  const { data: version } = useVersion();

  return (
    <Container disableGutters maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TypographyG width="33%">{version?.version ?? ""}</TypographyG>
        <TypographyG
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            width: "33%",
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
        <Link
          href="https://github.com/ZeusWPI/ZeSS"
          width="33%"
          textAlign="end"
        >
          Github © 2024
        </Link>
      </Box>
    </Container>
  );
};
