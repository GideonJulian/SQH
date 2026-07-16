"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";

const CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "Naira" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const optionRefs = useRef([]);

  const active = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  useEffect(() => {
    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function openMenu() {
    const currentIndex = CURRENCIES.findIndex((c) => c.code === currency);
    setActiveIndex(currentIndex);
    setOpen(true);
    requestAnimationFrame(() => optionRefs.current[currentIndex]?.focus());
  }

  function selectCurrency(code) {
    setCurrency(code);
    setOpen(false);
  }

  function handleTriggerKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  }

  function handleOptionKeyDown(e, index) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % CURRENCIES.length;
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + CURRENCIES.length) % CURRENCIES.length;
      setActiveIndex(prev);
      optionRefs.current[prev]?.focus();
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectCurrency(CURRENCIES[index].code);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
      >
        <span aria-hidden="true">{active.symbol}</span>
        <span>{active.code}</span>
        <ChevronDown
          size={14}
          strokeWidth={3}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select currency"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-40 border-2 border-black bg-white shadow-[4px_4px_0_#000]"
          >
            {CURRENCIES.map((c, index) => {
              const isSelected = c.code === currency;
              return (
                <li key={c.code} role="none">
                  <button
                    ref={(el) => (optionRefs.current[index] = el)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={activeIndex === index ? 0 : -1}
                    onClick={() => selectCurrency(c.code)}
                    onKeyDown={(e) => handleOptionKeyDown(e, index)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-colors ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    } ${index > 0 ? "border-t-2 border-black" : ""}`}
                  >
                    <span>
                      {c.symbol} {c.code}
                    </span>
                    <span className="text-[10px] font-bold normal-case tracking-normal opacity-60">
                      {c.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
