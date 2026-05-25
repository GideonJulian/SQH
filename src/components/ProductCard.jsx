"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const price =
    typeof product.price === "number"
      ? `$${product.price.toFixed(2)}`
      : product.price;

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
        <Link
          to={`/product/${product.id}`}
          className="block h-full"
          aria-label={`View ${product.title}`}
        >
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
        </Link>

        <div className="absolute left-1/2 bottom-8 z-10 hidden -translate-x-1/2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="flex items-center text-xs bg-white text-black px-4 py-4 uppercase  border-1 border-white transition-all duration-300 hover:bg-black hover:text-white"
            type="button"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </motion.button>
        </div>

        <motion.button
          whileTap={{
            scale: 0.92,
          }}
          className="absolute right-3 bottom-3 z-10 grid size-11 place-items-center bg-white text-black border-2 border-black shadow-[4px_4px_0_#000] md:hidden"
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart size={19} strokeWidth={2.5} />
        </motion.button>
      </div>

      <Link to={`/product/${product.id}`}>
        <h3 className="font-bold uppercase tracking-tight text-lg">
          {product.title}
        </h3>

        <p className="text-lg mt-1 font-semibold">{price}</p>
      </Link>
    </motion.div>
  );
}
