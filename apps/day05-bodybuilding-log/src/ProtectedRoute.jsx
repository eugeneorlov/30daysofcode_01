import { Navigate } from "react-router-dom";
import { useUser } from "./context/useUser";

export function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}
