import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/admin/login"
      />
    );
  }

  return children;
}
