"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CurrencySelector from "./CurrencySelector";

const navLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Shop",
    path: "/shop",
  },
  {
    label: "Cart",
    path: "/cart",
  },
];

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-black bg-white">
      <nav className="h-16 flex items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-6">
          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            className="md:hidden"
          >
            {/* <Menu /> */}
          </motion.button>

          <Link to="/" className="text-2xl font-black tracking-tight uppercase">
            SQH_QUEST
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs font-black uppercase tracking-[0.22em] transition-all duration-300 hover:tracking-[0.3em] ${
                    isActive ? "border-b-2 border-black pb-1" : "opacity-60"
                  }`
                }
              >
                {item.label}
                {item.path === "/cart" && itemCount > 0 && (
                  <span className="ml-2 inline-grid size-4 place-items-center bg-black text-white text-[10px]">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <CurrencySelector />

          <motion.div
            whileTap={{
              scale: 0.9,
            }}
            className="md:hidden"
          >
            <Link
              to="/cart"
              className="relative hidden  md:block"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 grid size-4 place-items-center bg-black text-white text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}