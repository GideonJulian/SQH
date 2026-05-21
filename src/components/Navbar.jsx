"use client";

import { Menu, Bolt } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-black bg-white">

      <nav className="h-16 flex items-center justify-between px-6">

        <motion.button
          whileTap={{
            scale: 0.9,
          }}
          className="md:hidden"
        >
          {/* <Menu /> */}
        </motion.button>

        <div className="text-2xl font-black tracking-tight uppercase">
          SQH_QUEST
        </div>

        <motion.button
          whileTap={{
            scale: 0.9,
          }}
        >
          {/* <Bolt /> */}
        </motion.button>
      </nav>
    </header>
  );
}