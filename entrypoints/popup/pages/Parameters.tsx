import { Outlet, useNavigate } from "react-router-dom";
import { Box, Container, MenuItem, MenuList, Paper } from "@mui/material";
import Close from "../components/Close";

import { useAuth } from "../lib/auth";

export default function () {
  const redirect = useNavigate();
  const { signOut } = useAuth();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Close redirectTo={"/"} />
      <Box
        sx={{
          flex: 1,
          marginBottom: "1em",
          position: "relative",
        }}
      >
        <h1>Parameters</h1>
        <Paper>
          <MenuList>
            <MenuItem
              onClick={() => {
                redirect("/parameters/phrase");
              }}
            >
              Pass phrase
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
                redirect("/");
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Paper>
        <Box sx={{ marginTop: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}
