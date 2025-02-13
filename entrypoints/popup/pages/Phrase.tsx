import { useState } from "react";
import { Box, Button, ButtonGroup, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateMnemonic } from "@scure/bip39";
import { wordlist as en } from "@scure/bip39/wordlists/english";

import CopyToClipboardButton from "../components/CopyToClipboardButton";
// import { GenerateMnemonic } from "../lib/account";
import { useAuth } from "../lib/auth";

export default function () {
  const redirect = useNavigate();
  const save = useAuth().setPassphrase;
  const [passphrase, setPassphrase] = useState<string>(generateMnemonic(en));
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box>
        <h1>Recovery phrase</h1>
        <p>
          This set of words is a mnemonic. <br />
          It is derived into keys and is used to secure your wallet
        </p>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          background:
            "linear-gradient(to right, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722)",
          backgroundClip: "text",
          border: "1px solid #666",
          borderRadius: "4px",
          flex: 1,
          fontSize: "1.5rem",
          height: "100%",
          padding: "2rem",
          position: "relative",
          transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          textFillColor: "transparent",
          wordBreak: "break-word",
        }}
      >
        {passphrase}
        <CopyToClipboardButton
          sx={{
            position: "absolute",
            right: "8px",
            top: "8px",
          }}
          text={passphrase}
        />
      </Box>
      <div
        style={{ display: "flex", flexDirection: "column", flexBasis: "100%" }}
      ></div>
      <ButtonGroup
        sx={{
          marginTop: "auto",
          display: "flex",
          alignSelf: "flex-end",
          flex: 1,
          margin: "1em 0",
        }}
      >
        <Button
          color="secondary"
          onClick={async () => {
            setPassphrase(generateMnemonic(en));
          }}
        >
          Regenerate
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            redirect("/phrase/own");
          }}
        >
          Import
        </Button>
        <Button
          onClick={async () => {
            await save(passphrase);
            redirect("/");
          }}
          variant="contained"
        >
          Save
        </Button>
      </ButtonGroup>
    </Container>
  );
}
