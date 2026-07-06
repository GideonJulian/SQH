import { useState } from "react";
import { Shield } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  isAdminAuthenticated,
  loginAdmin,
} from "../utils/adminAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/admin";

  if (isAdminAuthenticated()) {
    return <Navigate replace to={redirectTo} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginAdmin(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white antialiased selection:bg-white selection:text-black md:px-8">
      <div className="flex w-full max-w-[440px] flex-col items-center">
        <div className="mb-8">
          <Shield
            className="size-20 text-white"
            fill="currentColor"
            strokeWidth={1.5}
          />
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-6xl">
            Admin Access
          </h1>
          <p className="mt-3 text-xs font-black uppercase tracking-widest text-white/60">
            Performance Command Center
          </p>
        </header>

        <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-black uppercase tracking-widest text-white"
              htmlFor="admin-email"
            >
              Email
            </label>
            <input
              autoComplete="username"
              className="h-[60px] w-full border-0 bg-white px-4 text-base font-bold text-black outline-none placeholder:text-black/30 focus:ring-2 focus:ring-white"
              id="admin-email"
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="OPERATOR@SQH.COM"
              required
              type="email"
              value={email}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-end justify-between">
              <label
                className="text-xs font-black uppercase tracking-widest text-white"
                htmlFor="admin-password"
              >
                Password
              </label>
              <button
                className="text-[10px] font-black uppercase tracking-widest text-white/50 transition-opacity hover:text-white"
                type="button"
              >
                Reset
              </button>
            </div>
            <input
              autoComplete="current-password"
              className="h-[60px] w-full border-0 bg-white px-4 text-base font-bold text-black outline-none placeholder:text-black/30 focus:ring-2 focus:ring-white"
              id="admin-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>

          {error && (
            <p className="text-xs font-black uppercase tracking-widest text-red-400">
              {error}
            </p>
          )}

          <button
            className="mt-2 h-16 w-full border-2 border-white bg-white text-lg font-black uppercase tracking-tight text-black transition-all hover:bg-transparent hover:text-white active:scale-[0.98] disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <footer className="mt-8 flex flex-col items-center opacity-20">
          <div className="mb-4 h-px w-12 bg-white" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Secure Terminal Alpha-01
          </p>
        </footer>
      </div>

      <div className="pointer-events-none fixed bottom-0 right-0 select-none p-8 opacity-[0.03]">
        <span className="text-[160px] font-black leading-none md:text-[200px]">
          SQH
        </span>
      </div>
    </main>
  );
}
