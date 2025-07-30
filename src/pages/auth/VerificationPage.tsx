import React from "react";
import Button from "@mui/material/Button";
import useMutation from "ezhooks/lib/useMutation";
import useZod from "@hooks/useZod";
import { useLocation, useNavigate } from "react-router";
import { postResendCode, postVerificationEmail } from "@services/auth.service";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import Fade from "@mui/material/Fade";
import useParseError from "@hooks/useParseError";
import { formatCountdown } from "@utils/string";
import { useSnackbar } from "@contexts/SnackbarContext";

const TextField = React.lazy(() => import("@mui/material/TextField"));

const VerificationPage = () => {
  const { setSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const ctm = useParseError({
    label: {
      email: "Email",
    },
    message: {
      exists: ({ label }) => `${label} is exists`,
    },
  });

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [isSuccess, setSuccess] = React.useState(false);
  const [remaining, setRemaining] = React.useState(0);
  const [canResend, setCanResend] = React.useState(false);

  const form = useMutation({
    defaultValue: {
      code: "",
      email: "",
    },
  });

  const validation = useZod({
    data: form.data(),
    schema: (y) =>
      y.object({
        email: y.email(),
        code: y.string(),
      }),
  });

  const handleSubmit = async () => {
    const valid = await validation.validated();
    if (valid) {
      form.send({
        service: postVerificationEmail,
        onSuccess: async () => {
          setSuccess(true);
          window.history.replaceState(null, "", window.location.pathname);
          localStorage.removeItem("expiry");

          const timer = setTimeout(() => {
            navigate("/login");
            clearTimeout(timer);
          }, 1500);
        },
        onError: (e) => {
          if (e instanceof Response) {
            if (e.status === 422) {
              e.json().then((resp) => {
                validation.setError(ctm.parse(resp.error));
              });
            } else if (e.status === 404) {
            }
          }
        },
      });
    }
  };

  const handleClickResend = () => {
    form.send({
      service: postResendCode,
      onSuccess: async () => {
        setSnackbar("Kode verifikasi berhasil dikirim ulang ke email Anda.");
        setRemaining(300);
        setCanResend(false);
      },
      onError: (e) => {
        form.reset();
        if (e instanceof Response) {
          if (e.status === 422) {
            e.json().then((resp) => {
              validation.setError(ctm.parse(resp.error));
            });
          } else if (e.status === 404) {
            window.history.replaceState(null, "", window.location.pathname);
            setSnackbar(
              "Pengguna tidak ditemukan. Pastikan Anda telah mendaftar dengan email yang benar."
            );
          }
        }
      },
    });
  };

  const getRemainingSeconds = (): number => {
    const expiry = localStorage.getItem("expiry");
    if (expiry) {
      const expiryTime = parseInt(expiry, 10);
      const diff = Math.floor((expiryTime - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  React.useEffect(() => {
    if (!location.state?.email) {
      navigate("/login");
      return;
    }
    if (canResend) return;
    const currentRemaining = getRemainingSeconds();
    if (currentRemaining > 0) {
      setRemaining(currentRemaining);
    } else {
      const newExpiry = Date.now() + 300 * 1000;
      localStorage.setItem("expiry", newExpiry.toString());
      setRemaining(300);
    }

    timerRef.current = setInterval(() => {
      React.startTransition(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            localStorage.removeItem("expiry");
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [location.state.email, canResend]);

  React.useEffect(() => {
    if (!location.state?.email) return;
    form.setData({ email: location.state.email });
  }, [location.state.email]);

  if (isSuccess) {
    return (
      <Fade in={isSuccess} unmountOnExit>
        <Alert
          severity="success"
          variant="outlined"
          sx={{ width: "30%", margin: "24px auto" }}
        >
          Kode verifikasi berhasil!
        </Alert>
      </Fade>
    );
  }

  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      sx={{ width: "30%", margin: "24px auto", overflow: "hidden", p: 2 }}
    >
      <ListItemText
        primary="Verifikasi Alamat Email Anda"
        secondary="Kami telah mengirimkan kode verifikasi ke email Anda. Silakan masukkan 6 digit kode untuk melanjutkan proses.."
        slotProps={{
          primary: {
            variant: "subtitle1",
          },
          secondary: {
            variant: "body2",
          },
        }}
      />

      <TextField
        label="Kode"
        placeholder="Masukkan 6-digit kode"
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        value={form.value("code", "")}
        onChange={(e) => form.setData({ code: e.target.value })}
        error={validation.error("code")}
        helperText={validation.message("code")}
        onBlur={() => validation.validateAt("code")}
      />

      <div>
        <Button
          variant="text"
          disabled={!canResend}
          sx={{ p: 0 }}
          onClick={handleClickResend}
        >
          Kirim Ulang Kode. ({formatCountdown(remaining)})
        </Button>
      </div>

      <div>
        <Button
          loading={form.processing}
          disabled={form.processing || validation.error()}
          fullWidth
          onClick={handleSubmit}
        >
          Verifikasi
        </Button>
      </div>
    </Stack>
  );
};

export default VerificationPage;
