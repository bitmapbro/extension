import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
} from "@mui/material";
import { HasSignedIn } from "../lib/account";

export default function () {
  const redirect = useNavigate();
  useEffect(() => {
    (async () => {
      if (!(await HasSignedIn())) {
        redirect("/signin");
      }
    })();
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeNetwork = (event: SelectChangeEvent) => {};

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          flex: 1,
          marginBottom: "1em",
          position: "relative",
        }}
      >
        <h1>Account 1</h1>
        <Select
          id="demo-simple-select"
          defaultValue="Mainnet"
          label="Age"
          onChange={handleChangeNetwork}
        >
          <MenuItem value="Mainnet">Mainnet</MenuItem>
          <MenuItem value="Mainnet 2">Mainnet 2</MenuItem>
          <MenuItem value="Mainnet 3">Mainnet 3</MenuItem>
        </Select>
        <Box sx={{ marginTop: "auto" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Tokens" />
            <Tab label="Transactions" />
            <Tab label="DApps" />
          </Tabs>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}
