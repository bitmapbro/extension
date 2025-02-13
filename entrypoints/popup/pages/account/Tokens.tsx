import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
} from "@mui/material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import networks from "../../shared/networks";

export default function () {
  const redirect = useNavigate();
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
        <IconButton
          onClick={() => {
            redirect("/parameters");
          }}
          sx={{ position: "fixed", top: 0, right: 0, zIndex: 2000 }}
        >
          <SettingsApplicationsIcon />
        </IconButton>
        <h1>Account 1</h1>
        <Select
          defaultValue={networks[0].id}
          label="network"
          onChange={handleChangeNetwork}
        >
          {networks.map((network) => (
            <MenuItem key={network.id} value={network.id}>
              {network.name}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ marginTop: "auto" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Tokens" />
            <Tab label="Transactions" />
            <Tab label="DApps" />
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
}
