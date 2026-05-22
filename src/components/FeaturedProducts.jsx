"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { products } from "../data/products";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.9,
    filter: "blur(10px)",
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeaturedProducts() {
  return (
    <section className="hidden md:block relative py-32 px-8 max-w-[1440px] mx-auto overflow-hidden">
      {/* Animated ambient bg */}
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -60, 40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl"
      />

      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
        className="flex justify-between items-end mb-20 relative z-10"
      >
        <div>
          <span className="uppercase tracking-[0.3em] text-black/50 text-sm mb-3 block font-bold">
            NEW DROPS
          </span>

          <h2 className="text-6xl font-black uppercase tracking-tight">
            THE ELITE LINE
          </h2>
        </div>

        <motion.a
          whileHover={{
            letterSpacing: "0.2em",
          }}
          className="uppercase border-b-2 border-black pb-1 font-bold cursor-pointer"
        >
          VIEW ALL PRODUCTS
        </motion.a>
      </motion.div>

      {/* Products */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        className="grid grid-cols-3 gap-12 relative z-10"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="relative"
          >
            <ProductCard product={product} />

            <span className="absolute -top-8 right-0 text-8xl font-black opacity-[0.04] pointer-events-none">
              0{index + 1}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
