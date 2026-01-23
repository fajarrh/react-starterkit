import React from "react";
import Button from "@mui/material/Button";
import Loading from "@components/base/Skeleton/Spinner";
import Paper from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";

import useMutation from "ezhooks/lib/useMutation";
import useZod from "@hooks/useZod";
import { postRegister } from "@services/auth.service";
import { useNavigate } from "react-router";
import useParseError from "@hooks/useParseError";
import z from "@schemas/_schema.config";

const TextField = React.lazy(() => import("@mui/material/TextField"));

const InputPassword = React.lazy(
  () => import("@components/base/Input/InputPassword")
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const ctm = useParseError({
    label: {
      email: "Email",
      phoneNumber: "Kontak",
    },
    message: {
      exists: ({ label }) => `${label} sudah terdaftar`,
    },
  });

  const [isSuccess, setSuccess] = React.useState(false);

  const form = useMutation({
    defaultValue: {
      email: "",
      password: "",
      name: "",
    },
  });

  const validation = useZod({
    data: form.data,
    schema: z.object({
      email: z.email().nonempty(),
      password: z.string().nonempty(),
      name: z.string().nonempty(),
    }),
  });

  const handleSubmit = () => {
    const valid = validation.validated();
    if (valid) {
      form.send({
        service: postRegister,
        onSuccess: async (resp) => {
          if (resp.status === 201) {
            const res = await resp.json();
            setSuccess(true);
            navigate(`/verification`, {
              state: { email: res.data.email },
            });
          }
          form.reset();
        },
        onError: (e) => {
          if (e instanceof Response) {
            if (e.status === 422) {
              e.json().then((resp) => {
                validation.setError(ctm.parse(resp.error));
              });
            }
          }
        },
      });
    }
  };

  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={3}
      sx={{
        width: "32%",
        margin: "24px auto",
        overflow: "hidden",
        overflowY: "auto",
        p: 2,
      }}
    >
      <ListItemText
        primary="Start App"
        secondary="Start App"
        slotProps={{
          primary: {
            variant: "subtitle1",
            fontWeight: 500,
          },
          secondary: {
            variant: "body2",
          },
        }}
      />

      <Fade in={isSuccess} unmountOnExit>
        <Alert variant="outlined">
          Registrasi berhasil! Silakan cek email untuk verifikasi akun Anda.
        </Alert>
      </Fade>

      <TextField
        name="name"
        label="Nama"
        placeholder="Masukkan nama"
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        value={form.value("name", "")}
        onChange={(e) => form.setData({ name: e.target.value })}
        error={validation.error("name")}
        helperText={validation.message("name")}
        onBlur={() => validation.validateAt("name")}
      />

      <TextField
        name="email"
        label="Email"
        placeholder="Masukkan alamat email"
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        value={form.value("email", "")}
        onChange={(e) => form.setData({ email: e.target.value })}
        error={validation.error("email")}
        helperText={validation.message("email")}
        onBlur={() => validation.validateAt("email")}
      />

      <React.Suspense fallback={<Loading />}>
        <InputPassword
          margin="normal"
          required
          fullWidth
          name="password"
          label="Kata Sandi"
          type="password"
          id="password"
          variant="standard"
          autoComplete="current-password"
          placeholder="Kata Sandi"
          value={form.value("password")}
          error={validation.error("password")}
          helperText={validation.message("password")}
          onChange={(e) => form.setData({ password: e.target.value })}
          onBlur={() => validation.validateAt("password")}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </React.Suspense>

      <div>
        <Button
          loading={form.processing}
          disabled={form.processing || validation.error()}
          fullWidth
          onClick={handleSubmit}
        >
          Daftar Sekarang
        </Button>
      </div>
    </Stack>
  );
};

export default RegisterPage;
