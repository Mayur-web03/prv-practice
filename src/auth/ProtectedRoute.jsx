import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { isAdminRole } from "./roles";
import { LoadingView, PermissionDenied } from "../components/ui/StateViews";

export default function ProtectedRoute({ area, roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingView label="Checking your session…" />;

  if (!user) {
    const login = area === "admin" ? "/admin/login" : "/dealer-portal/login";
    return <Navigate to={login} replace state={{ from: location.pathname }} />;
  }

  const inArea = area === "admin" ? isAdminRole(user.role) : user.role === "dealer";
  if (!inArea) return <PermissionDenied />;
  if (roles && !roles.includes(user.role)) return <PermissionDenied />;

  return children;
}