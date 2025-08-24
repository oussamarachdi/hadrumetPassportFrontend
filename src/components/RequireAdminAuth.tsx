import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAdminAuthProps {
  children: ReactNode;
}

const RequireAdminAuth = ({ children }: RequireAdminAuthProps) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
};

export default RequireAdminAuth; 