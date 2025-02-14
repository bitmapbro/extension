import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { HashRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Alert from "./components/Alert";
import { AuthProvider, PrivateRoutes } from "./lib/auth";
import AccountTokens from "./pages/account/Tokens";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Parameters from "./pages/Parameters";
import Phrase from "./pages/Phrase";
import OwnPhrase from "./pages/OwnPhrase";
import Reset from "./pages/Reset";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/phrase" element={<Phrase />} />
            <Route path="/phrase/own" element={<OwnPhrase />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/account/tokens" element={<AccountTokens />} />
              <Route path="/" element={<Home />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/parameters" element={<Parameters />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </HashRouter>
      {/* <RouterProvider router={router} /> */}
      <Alert />
    </ThemeProvider>
  </React.StrictMode>
);
