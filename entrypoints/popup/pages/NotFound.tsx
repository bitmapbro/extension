import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";

export default function () {
  const location = useLocation();
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "3em",
      }}
    >
      location "{location.pathname}" not found
    </Container>
  );
}
