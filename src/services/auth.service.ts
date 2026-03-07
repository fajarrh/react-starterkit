import { EventSend } from "ezhooks";
import { LoaderFunction, redirect } from "react-router";
import api from "./api.service";

const baseUrl = import.meta.env.VITE_APP_BASE_API_URL;

export const url = {
  current: `${baseUrl}/user`,
  login: `${baseUrl}/login`,
  register: `${baseUrl}/register`,
  verification: `${baseUrl}/verification`,
  resend: `${baseUrl}/resend`,
  logout: `${baseUrl}/logout`,
};

export const loader: LoaderFunction = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }

  const req = await fetch(url.current, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (req.status > 400) {
    localStorage.removeItem("token");
    return redirect("/login");
  }

  const resp = await req.json();
  return resp.data;
};

export const postLogin = (event: EventSend) => {
  return api.post(url.login, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const postRegister = (event: EventSend) => {
  return api.post(url.register, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const postVerificationEmail = async (event: EventSend) => {
  return api.post(url.verification, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const postResendCode = (event: EventSend) => {
  return api.post(url.resend, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const postLogout = (event: EventSend) => {
  return api.post(url.logout, event.data?.(), {
    signal: event.ctr?.signal,
  });
};
