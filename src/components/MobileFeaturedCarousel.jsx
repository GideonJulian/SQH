"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";

export default function MobileFeaturedCarousel() {
  return (
    <section className="md:hidden mt-16">
      <div className="px-6 mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Featured Drops
        </h2>

        <span className="font-bold text-sm border-b-2 border-black pb-1 uppercase tracking-wider">
          View All
        </span>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 snap-x snap-mandatory">
        {products.slice(0, 3).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{
              opacity: 0,
              x: 80,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
            }}
            className="flex-none w-[85%] snap-start"
          > 
            <div className="aspect-[4/5] overflow-hidden mb-4 bg-zinc-100 relative">
              <Link
                to={`/product/${product.id}`}
                className="block h-full"
                aria-label={`View ${product.title}`}
              >
                <motion.img
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="w-full h-full object-cover"
                  src={product.src}
                  alt={product.title}
                />

                {product.badge && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] px-3 py-1 uppercase tracking-widest">
                    {product.badge}
                  </div>
                )}
              </Link>

              <motion.button
                whileTap={{
                  scale: 0.92,
                }}
                className="absolute right-4 bottom-4 z-10 grid size-12 place-items-center bg-white text-black border-2 border-black shadow-[4px_4px_0_#000]"
                type="button"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
              </motion.button>
            </div>

            <Link to={`/product/${product.id}`}>
              <p className="font-bold uppercase tracking-tight">
                {product.title}
              </p>

              <p className="mt-1 text-lg font-semibold">{product.price}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
