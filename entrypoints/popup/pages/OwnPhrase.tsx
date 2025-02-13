import { Box, Button, ButtonGroup, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { alert } from "../components/Alert";
import { useAuth } from "../lib/auth";

export default function () {
  const redirect = useNavigate();
  const { setPassphrase } = useAuth();
  return (
    <Container>
      <form
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
        onSubmit={async (e: React.FormEvent) => {
          try {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              phrase: { value: string };
            };
            await setPassphrase(target.phrase.value);
            redirect("/");
          } catch (error: any) {
            alert(`Error: ${error.message}`, "error");
          }
        }}
      >
        <Box>
          <h1>Recovery phrase</h1>
          <p>
            This set of words is a mnemonic. <br />
            It is derived into keys and is used to secure your wallet
          </p>
        </Box>
        <textarea
          name="phrase"
          style={{
            height: "100%",
          }}
        ></textarea>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexBasis: "100%",
          }}
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
              redirect("/phrase");
            }}
          >
            Generate
          </Button>
          <Button
            type="submit"
            onClick={async () => {
              // await save("text");
              // redirect("/");
            }}
            variant="contained"
          >
            Save
          </Button>
        </ButtonGroup>
      </form>
    </Container>
  );
}
