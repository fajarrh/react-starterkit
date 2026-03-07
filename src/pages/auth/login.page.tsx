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

import Loading from "@components/ui/Skeleton/Spinner";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LoadComponent from "@components/ui/LoadComponent/LoadComponent";
import z from "@schemas/_schema.config";

const TextField = React.lazy(() => import("@mui/material/TextField"));

const LockOutlinedIcon = LoadComponent(
  () => import("@mui/icons-material/LockOutlined"),
);
const InputPassword = React.lazy(
  () => import("@components/ui/Input/InputPassword"),
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

  const validation = useZod({
    data: form.data,
    schema: z.object({
      email: z.email().nonempty(),
      password: z.string().nonempty(),
    }),
  });

  const handleSubmit = () => {
    const valid = validation.validated();
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
              'url("https://v5.mui.com/static/images/templates/templates-images/sign-in-side-bg.png")',

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
                  defaultValue={form.value("email")}
                  error={validation.error("email")}
                  helperText={validation.message("email")}
                  onChange={(e) => form.setData({ email: e.target.value })}
                  onBlur={() => validation.validateAt("email")}
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
                  defaultValue={form.value("password")}
                  error={validation.error("password")}
                  helperText={validation.message("password")}
                  onChange={(e) => form.setData({ password: e.target.value })}
                  onBlur={() => validation.validateAt("password")}
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
