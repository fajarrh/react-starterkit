import { useAuth } from "@contexts/AuthContext";
import { Navigate, useLocation } from "react-router";

const AuthLayouts = ({ children }: { children: React.ReactNode }) => {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthLayouts;
