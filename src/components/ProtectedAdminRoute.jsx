import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchAdminProfile, setAdminAuthenticated } from "../utils/adminAuth";
import { getAuthToken } from "../services/api";

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function validate() {
      const token = getAuthToken();

      if (!token) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      try {
        await fetchAdminProfile();
        if (!cancelled) setStatus("authenticated");
      } catch {
        setAdminAuthenticated(false);
        if (!cancelled) setStatus("unauthenticated");
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-xs font-black uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
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
