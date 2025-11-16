import { EventSend } from "ezhooks";
import { LoaderFunction, redirect } from "react-router";

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

export const postLogin = async (event: EventSend) => {
  const res = await fetch(url.login, {
    method: "post",
    signal: event.ctr.signal,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event.data),
  });

  return await res.json();
};

export const postRegister = async (event: EventSend) => {
  const res = await fetch(url.register, {
    method: "post",
    signal: event.ctr.signal,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event.data),
  });

  return res;
};

export const postVerificationEmail = async (event: EventSend) => {
  const res = await fetch(url.verification, {
    method: "post",
    signal: event.ctr.signal,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event.data),
  });

  return res;
};

export const postResendCode = async (event: EventSend) => {
  const res = await fetch(url.resend, {
    method: "post",
    signal: event.ctr.signal,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event.data),
  });

  return res;
};

export const postLogout = (event: EventSend) => {
  return fetch(url.logout, {
    method: "post",
    signal: event.ctr?.signal,
    headers: {
      "content-type": "application/json",
    },
  });
};