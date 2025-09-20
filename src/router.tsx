
import { createBrowserRouter } from "react-router";
import { loader } from "@services/auth.service";
import LoadComponent from "@components/base/LoadComponent/LoadComponent";

const AppLayouts = LoadComponent(() => import("@components/layouts/AppLayout"));
const GuestLayout = LoadComponent(
  () => import("@components/layouts/GuestLayout")
);

const NotFoundPage = LoadComponent(() => import("@pages/error/notfound.page"));
const SignInPage = LoadComponent(() => import("@pages/auth/login.page"));
const RegisterPage = LoadComponent(() => import("@pages/auth/register.page"));
const VerificationPage = LoadComponent(() => import("@pages/auth/verification.page"));

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <SignInPage />,
    },
    {
      element: <GuestLayout />,
      children: [
        { path: "/register", element: <RegisterPage /> },
        { path: "/verification", element: <VerificationPage /> },
      ],
    },
    {
      id: "root",
      path: "/",
      loader,
      element: <AppLayouts />,
      hydrateFallbackElement: <span>loading...</span>,
      children: [
      
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_fetcherPersist: true,
      v7_startTransition: true,
    },
  }
);

export default router;

 