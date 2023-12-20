import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";

function Component({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingProfile } = useAuth();

  if (isLoadingProfile) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
}

export default Component;
