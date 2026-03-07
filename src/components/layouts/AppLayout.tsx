import React from "react";
import ErrorBoundary from "@components/ui/ErrorBoundary";
import Snackbar from "@components/ui/Snackbar";
import { useAuth } from "@contexts/AuthContext";
import SnackbarProvider from "@contexts/SnackbarContext";
import AlertProvider from "@contexts/AlertContext";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { Outlet, useRouteLoaderData } from "react-router";
import Header from "@components/ui/Header";
import SideBar from "@components/ui/SideBar";
import AlertDialog from "@components/ui/Dialog/AlertDialog";

const Wrapper = styled("div")({
  display: "flex",
  flex: 1,
  height: "100vh",
  margin: 0,
  padding: 0,
  overflow: "hidden",
});

const Main = styled("main")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  flexGrow: 1,
  height: "100vh",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflow: "hidden",
}));

export function HydrateFallback() {
  return <p>loading...</p>;
}

export default function AppLayout() {
  const user = useRouteLoaderData("root");
  const auth = useAuth();

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }

    auth.setUser(user);
  }, []);

  return (
    <AlertProvider>
      <SnackbarProvider>
        <Wrapper>
          <Header />
          <SideBar />

          <Main id="main">
            <ErrorBoundary
              fallback={<p style={{ textAlign: "center" }}>Something Wrong</p>}
            >
              <Toolbar sx={{ height: { xs: 48 }, minHeight: { xs: 48 } }} />
              <Outlet />
            </ErrorBoundary>
          </Main>

          <Snackbar />
          <AlertDialog />
        </Wrapper>
      </SnackbarProvider>
    </AlertProvider>
  );
}
