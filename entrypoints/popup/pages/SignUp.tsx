import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const MIN_PASSWORD_LENGTH = 8;
const setPasswordFormSchema = z
  .object({
    email: z.string().email("Invalid email address"), // not using passwordSchema here, as we want to show a different error message
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Must contain at least ${MIN_PASSWORD_LENGTH} characters`
      ),
    repeatPassword: z.string(), // not using passwordSchema here, as we want to show a different error message
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type PasswordForm = z.infer<typeof setPasswordFormSchema>;

export default function () {
  const redirect = useNavigate();
  const { hasSignedUp, signUp } = useAuth();

  useEffect(() => {
    (async () => {
      if (hasSignedUp) {
        redirect("/signin");
      }
    })();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordForm>({
    criteriaMode: "firstError",
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const handleForm = handleSubmit(async ({ email, password }) => {
    try {
      await signUp(email, password);
      redirect("/");
    } catch (error) {
      setError("root", { message: `Something went wrong: ${error}` });
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
      <h1>Hey, you2!</h1>
      <p>
        That is the first time you are using this wallet or it has been erased.
        <br />
        Set a password to protect it
      </p>

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
          <Alert sx={{ display: !!errors.root ? "" : "none" }} severity="error">
            {errors.root?.message || ""}
          </Alert>
          <TextField
            label="Email"
            type="text"
            margin="dense"
            variant="outlined"
            error={!!errors.email}
            inputRef={(input) => input && input.focus()}
            {...register("email", { required: true })}
          />
          <TextField
            label="Password"
            type="password"
            margin="dense"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message || ""}
            {...register("password", { required: true })}
          />
          <TextField
            label="Repeat password"
            type="password"
            margin="dense"
            variant="outlined"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message || ""}
            {...register("repeatPassword", { required: true })}
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
          <Button type="submit" variant="contained" sx={{ marginTop: "auto" }}>
            Signup
          </Button>
        </ButtonGroup>
      </FormControl>
    </Container>
  );
}
