import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Component({ children }: { children: React.ReactNode }) {
  const { isHasAccessToken } = useAuth();
  if (isHasAccessToken()) {
    return <Navigate to="/dashboard/profile" />;
  }

  return <>{children}</>;
}

export default Component;
