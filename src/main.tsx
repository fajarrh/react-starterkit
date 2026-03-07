import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import AppProvider from "@contexts/AppContext";
import AuthProvider from "@contexts/AuthContext";
import router from "./router";
import defaultTheme from "@themes/defaultTheme";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "@mui/material/styles";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
