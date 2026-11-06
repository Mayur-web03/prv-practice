import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { isAdminRole } from "../../auth/roles";

// Signed out -> "Dealer Login". Signed in -> link straight to their portal.
export default function DealerLoginLink({ className = "btn btn--outline" }) {
  const { user } = useAuth();

  if (user) {
    const to = isAdminRole(user.role) ? "/admin" : "/dealer-portal";
    return (
      <Link to={to} className={className}>
        My Portal
      </Link>
    );
  }
  return (
    <Link to="/dealer-portal/login" className={className}>
      Dealer Login
    </Link>
  );
}