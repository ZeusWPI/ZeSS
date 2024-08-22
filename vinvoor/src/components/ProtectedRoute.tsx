import { FC, ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user?.admin) return <Navigate to="/" replace />;

  return children;
};
