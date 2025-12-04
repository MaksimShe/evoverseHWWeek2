import { Outlet, Navigate } from "react-router-dom";
import { useAppContext } from "./hooks/UseAppContext.tsx";

export const ProtectedRoute = () => {
  const { user } = useAppContext();

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};