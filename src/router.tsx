
import { createBrowserRouter } from "react-router";
import { loader } from "@services/auth.service";
import LoadComponent from "@components/base/LoadComponent/LoadComponent";

const AppLayouts = LoadComponent(() => import("@components/layouts/AppLayout"));
const GuestLayout = LoadComponent(
  () => import("@components/layouts/GuestLayout")
);

const NotFoundPage = LoadComponent(() => import("@pages/error/PageNotFound"));
const SignInPage = LoadComponent(() => import("@pages/auth/LoginPage"));
const RegisterPage = LoadComponent(() => import("@pages/auth/RegisterPage"));
const VerificationPage = LoadComponent(
  () => import("@pages/auth/VerificationPage")
);

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

 