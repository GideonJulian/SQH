"use client";

import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{
        y: -12,
      }}
      transition={{
        duration: 0.3,
      }}
      className="group relative"
    >
      <div className="aspect-[4/5] bg-zinc-100 mb-6 overflow-hidden relative">

        <motion.img
          whileHover={{
            scale: 1.06,
          }}
          transition={{
            duration: 0.7,
          }}
          className="w-full h-full object-cover"
          src={product.src}
          alt={product.title}
        />

        {product.badge && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] tracking-widest uppercase font-bold">
            {product.badge}
          </div>
        )}

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <h3 className="font-bold uppercase tracking-tight text-lg">
        {product.title}
      </h3>

      <p className="text-lg mt-1 font-semibold">
        {product.price}
      </p>
    </motion.div>
  );
}