"use client";

import { House, ShoppingBag, Search, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "HOME",
    icon: House,
    active: true,
  },
  {
    label: "SHOP",
    icon: ShoppingBag,
  },
  {
    label: "SEARCH",
    icon: Search,
  },
  {
    label: "CART",
    icon: ShoppingCart,
  },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-5 left-4 right-4 z-50">
      <div className="flex items-center justify-around h-20 bg-black border-2 border-black shadow-2xl overflow-hidden">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <motion.a
              key={item.label}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              className={`flex flex-col items-center justify-center h-full w-full transition-all duration-300 ${
                item.active
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
              href="#"
            >
              <Icon
                size={22}
                className={item.active ? "fill-black" : ""}
              />

              <span className="font-black text-[10px] tracking-[0.2em] mt-1 uppercase">
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </nav>
  );
}