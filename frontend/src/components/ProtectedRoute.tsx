import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/api";
import Loading from "./Loading";
import Forbidden from "./Forbidden";

export default function ProtectedRoute({
  roles,
  children,
}: {
  roles?: Role[];
  children: ReactNode;
}) {
  const { user, loading, sessionExpired } = useAuth();
  if (loading) return <Loading />;
  if (!user)
    return (
      <Navigate to={sessionExpired ? "/login?expired=1" : "/login"} replace />
    );
  if (roles && !roles.includes(user.role)) return <Forbidden />;
  return <>{children}</>;
}
