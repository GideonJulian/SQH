"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { House, ShoppingBag, Search, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "HOME",
    icon: House,
    path: "/",
  },
  {
    label: "SHOP",
    icon: ShoppingBag,
    path: "/shop",
  },
  {
    label: "SEARCH",
    icon: Search,
    path: "/search",
  },
  {
    label: "CART",
    icon: ShoppingCart,
    path: "/cart",
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-5 left-4 right-4 z-50">
      <div
        className="
          flex items-center justify-around
          h-20
          bg-black/95
          backdrop-blur-md
          border border-white/10
          shadow-[0_10px_30px_rgba(0,0,0,0.45)]
          rounded-2xl
          overflow-hidden
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              className={`flex flex-col items-center justify-center h-full w-full transition-all duration-300 ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={22} />

              <span className="font-black text-[10px] tracking-[0.2em] mt-1 uppercase">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}