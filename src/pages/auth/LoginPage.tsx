import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ThemeProvider from "@mui/system/ThemeProvider";
import defaultTheme from "@themes/defaultTheme";
import useMutation from "ezhooks/lib/useMutation";
import { postLogin } from "@services/auth.service";
import useZod from "@hooks/useZod";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router";

import Loading from "@components/base/Skeleton/Spinner";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LoadComponent from "@components/base/LoadComponent/LoadComponent";

const TextField = React.lazy(() => import("@mui/material/TextField"));

const LockOutlinedIcon = LoadComponent(
  () => import("@mui/icons-material/LockOutlined")
);
const InputPassword = React.lazy(
  () => import("@components/base/Input/InputPassword")
);

const SignIn = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useMutation({
    defaultValue: {
      email: "",
      password: "",
    },
  });

  const yup = useZod({
    data: form.data(),
    schema: (y) =>
      y.object({
        email: y.email(),
        password: y.string(),
      }),
  });

  const handleSubmit = () => {
    const valid = yup.validated();
    if (valid) {
      form.send({
        service: postLogin,
        onSuccess: ({ data }) => {
          auth.setLogin(true);
          auth.setUser(data.user as Me);
          auth.setToken(data.token as string);
          navigate("/", { replace: true });
        },
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline enableColorScheme />

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          size={{ xs: false, sm: 4, md: 8 }}
          sx={{
            backgroundImage:
              'url("http://localhost:8011/public/image/cover-login.png")',

            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        />
        <Grid
          size={{ xs: 12, sm: 8, md: 4 }}
          component={Paper}
          // elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <React.Suspense fallback={<Loading />}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={form.value("email")}
                  error={yup.error("email")}
                  helperText={yup.message("email")}
                  onChange={(e) => form.setData({ email: e.target.value })}
                  onBlur={() => yup.validateAt("email")}
                />
              </React.Suspense>

              <React.Suspense fallback={<Loading />}>
                <InputPassword
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={form.value("password")}
                  error={yup.error("password")}
                  helperText={yup.message("password")}
                  onChange={(e) => form.setData({ password: e.target.value })}
                  onBlur={() => yup.validateAt("password")}
                />
              </React.Suspense>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleSubmit}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid size={6}>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid size={6} textAlign={"right"}>
                  <Link href="/register" variant="body2">
                    {" Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignIn;
