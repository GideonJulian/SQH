import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-black text-white min-h-[921px] flex flex-col items-center justify-center overflow-hidden px-8">
      
      {/* Animated background watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[40vw] font-black tracking-widest leading-none">
          SQH
        </span>
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display-xl text-[80px] font-[900]  uppercase mb-8 leading-none"
        >
          GEAR UP.<br />SHOW UP.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white/70 text-[18px] leading-[1.6] font-[400] tracking-normal max-w-xl mx-auto mb-12"
        >
          Discipline is freedom. High-performance apparel engineered for those who treat every day as the main quest.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black font-bold px-12 py-5 uppercase tracking-widest border-2 border-white transition-all"
        >
          SHOP THE COLLECTION
        </motion.button>
      </div>

      {/* Floating scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span className="material-symbols-outlined text-4xl">
          arrow_downward
        </span>
      </motion.div>
    </section>
  );
}