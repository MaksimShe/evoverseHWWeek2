import { Outlet, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore.ts';

export const ProtectedRoute = () => {
  const user = useAppStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
