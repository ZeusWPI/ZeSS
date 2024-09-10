import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { data: user } = useUser();

  if (!user?.admin) return <Navigate to="/" replace />;

  return children;
};
