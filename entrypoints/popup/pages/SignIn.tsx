import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuth } from "../lib/auth";

const setFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Form = z.infer<typeof setFormSchema>;

export default function () {
  const redirect = useNavigate();
  const { hasSignedUp, signIn } = useAuth();
  useEffect(() => {
    (async () => {
      if (!hasSignedUp) {
        redirect("/signup");
      }
    })();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({
    criteriaMode: "firstError",
    resolver: zodResolver(setFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleForm = handleSubmit(async ({ email, password }) => {
    try {
      await signIn(email, password);
      redirect("/");
    } catch (error) {
      console.log(error);
      setError("password", { message: "Unable to sign you in" });
    }
  });

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Unlock your wallet</h1>

      <FormControl
        component="form"
        onSubmit={handleForm}
        sx={{
          alignItems: "stretch",
          display: "flex",
          flex: 1,
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", flexBasis: "100%" }}
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message || ""}
            inputRef={(input) => input && input.focus()}
            sx={{ mb: 2 }}
            {...register("email")}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message || ""}
            sx={{ mb: 2 }}
            {...register("password")}
          />
        </Box>
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
            onClick={() => {
              redirect("/reset");
            }}
          >
            Reset account
          </Button>
          <Button type="submit" variant="contained">
            Signin
          </Button>
        </ButtonGroup>
      </FormControl>
    </Container>
  );
}
