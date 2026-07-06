"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white min-h-[80vh] md:min-h-screen flex items-center">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[700px] h-[700px] rounded-full bg-white/5 blur-3xl -top-40 -left-40"
      />

      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-20%] bottom-0 opacity-10"
      >
        <span className="text-[200px] md:text-[500px] font-black leading-none">
          SQH
        </span>
      </motion.div>

      <div className="relative z-10 px-3 md:px-12 pt-24 md:pt-0 max-w-6xl w-full">
        <motion.h1
          initial={{
            opacity: 0,
            y: 80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="text-6xl md:text-[9rem] leading-none font-black uppercase tracking-tight mb-8"
        >
          Move. 
          <br />
          Different.
        </motion.h1>

        <motion.button
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
            duration: 0.8,
          }}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="bg-white text-black px-8 py-4 uppercase font-bold tracking-[0.2em] border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
        >
          Shop Collection
        </motion.button>
      </div>
    </section>
  );
}
