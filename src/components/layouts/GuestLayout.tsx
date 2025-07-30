import ErrorBoundary from "@components/base/ErrorBoundary";
import Snackbar from "@components/base/Snackbar";
import SnackbarProvider from "@contexts/SnackbarContext";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router";
import AlertDialog from "@components/base/Dialog/AlertDialog";
import GuestHeader from "@components/base/Header/GuestHeader";

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

const GuestLayout = () => {
  return (
    <SnackbarProvider>
      <Wrapper>
        <GuestHeader />

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
  );
};

export default GuestLayout;
