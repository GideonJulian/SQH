import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
} from "../utils/adminAuth";

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE;

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/admin";

  if (isAdminAuthenticated()) {
    return <Navigate replace to={redirectTo} />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!ADMIN_PASSCODE) {
      setError("Admin passcode is not configured.");
      return;
    }

    if (passcode !== ADMIN_PASSCODE) {
      setError("Invalid admin passcode.");
      return;
    }

    setAdminAuthenticated(true);
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-black">
      <form
        className="w-full max-w-md border-2 border-black bg-white p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center bg-black text-white">
            <LockKeyhole size={18} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
              SQH
            </p>
            <h1 className="text-3xl font-black uppercase leading-none">
              Admin Login
            </h1>
          </div>
        </div>

        <label
          className="mb-2 block text-xs font-black uppercase tracking-widest"
          htmlFor="admin-passcode"
        >
          Passcode
        </label>
        <input
          autoComplete="current-password"
          className="w-full rounded-none border-0 border-b-2 border-black bg-transparent px-0 py-3 text-lg font-bold focus:outline-none"
          id="admin-passcode"
          onChange={(event) => {
            setPasscode(event.target.value);
            setError("");
          }}
          type="password"
          value={passcode}
        />

        {error && (
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-red-600">
            {error}
          </p>
        )}

        <button
          className="mt-8 w-full border-2 border-black bg-black py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black active:scale-[0.98]"
          type="submit"
        >
          Enter Admin
        </button>
      </form>
    </main>
  );
}
