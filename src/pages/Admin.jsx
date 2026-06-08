import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAdminAuthenticated } from "../utils/adminAuth";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col gap-6 border-b-2 border-black pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-black/50">
              Protected
            </p>
            <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
              Admin
            </h1>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 border-2 border-black px-5 py-3 text-xs font-black uppercase tracking-widest transition-all hover:bg-black hover:text-white"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {["Orders", "Products", "Customers"].map((item) => (
            <div className="border-2 border-black p-6" key={item}>
              <h2 className="text-2xl font-black uppercase">{item}</h2>
              <p className="mt-3 text-sm font-bold uppercase tracking-widest text-black/50">
                Admin module locked behind route protection.
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
