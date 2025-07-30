import { createRoot } from "react-dom/client";
import defaultTheme from "@themes/defaultTheme";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import AppProvider from "@contexts/AppContext";
import AuthProvider from "@contexts/AuthContext";
import interceptor from "@utils/interceptor";
import { RouterProvider } from "react-router/dom";
import router from "./router";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  </ThemeProvider>
);

const { fetch: watch } = window;
window.fetch = interceptor(watch);
