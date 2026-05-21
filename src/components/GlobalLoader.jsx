"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo pulse */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white text-4xl font-black tracking-[0.3em]"
            >
              SQH
            </motion.div>

            {/* Loading line */}
            <div className="w-40 h-[2px] bg-white/20 overflow-hidden relative">
              <motion.div
                className="absolute left-0 top-0 h-full bg-white"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <p className="text-white/60 text-xs tracking-[0.3em] uppercase">
              Loading Experience
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}