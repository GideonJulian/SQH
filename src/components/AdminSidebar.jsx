import { Grid2X2, Package, User, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
const navItems = [
  { label: "Dashboard", icon: Grid2X2, path: "/admin/" },
  { label: "Products", icon: Package, path: "/admin" },
  // { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  // { label: "Customers", icon: Users, path: "/admin/customers" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r-2 border-black bg-white lg:flex">
      <div className="px-8 py-10">
        <h1 className="text-2xl font-black italic uppercase tracking-tight text-black">
          SQH Admin
        </h1>
        <p className="mt-1 text-xs font-black uppercase tracking-tight text-black/40">
          Performance Command
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-tight ${
                active
                  ? "bg-black text-white"
                  : "text-black/50 hover:bg-black/5 hover:text-black"
              }`}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-black/10 p-8">
        <button
          className="flex w-full items-center justify-center gap-2 border-2 border-black bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          type="button"
          onClick={() => navigate("/admin/upload")}
        >
          <Plus size={16} />
          New Product
        </button>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-black text-white">
            <User size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase leading-none">
              SQH Admin Profile
            </p>
            <p className="mt-1 text-[10px] uppercase text-black/50">
              Session Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
