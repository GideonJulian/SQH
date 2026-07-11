import { Outlet, NavLink } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { ClipboardList, Grid2X2, Package, PlusCircleIcon, ShoppingCart, Upload } from "lucide-react";

export default function AdminLayout() {
  const mobileNav = [
    {
      label: "Dashboard",
      icon: Grid2X2,
      path: "/admin",
    },
      {
      label: "Upload",
      icon: PlusCircleIcon,
      path: "/admin/upload",
    },
    {
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
  
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminSidebar />

      <Outlet />

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t-2 border-black bg-white py-4 lg:hidden">
        {mobileNav.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/admin"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-black" : "text-black/50"
              }`
            }
          >
            <Icon size={22} strokeWidth={2.4} />
            <span className="text-[10px] font-black uppercase">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
