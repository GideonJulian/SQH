"use client";

import { useEffect } from "react";

const CATEGORY_LABELS = {
  outerwear: "OUTERWEAR",
  training: "TRAINING BASES",
  accessories: "ACCESSORIES",
  footwear: "FOOTWEAR",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function MobileFilterOverlay({
  filters,
  onClose,
  onApply,
  onClear,
  onToggleCategory,
  onUpdateSize,
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col md:hidden">
      <div className="px-6 h-20 flex items-center justify-between border-b-2 border-black">
        <h1 className="font-display-xl text-[40px] font-black tracking-tighter">
          FILTERS
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="font-bold text-black border-b-2 border-black leading-none pb-1 hover:bg-black hover:text-white transition-none px-2"
        >
          CLOSE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 pb-32">
        <section>
          <h2 className="text-xl font-black text-black mb-6 tracking-tighter uppercase border-l-8 border-black pl-4">
            CATEGORY
          </h2>

          <div className="space-y-4">
            {Object.keys(filters.categories).map((key) => {
              const inputId = `mobile-filter-${key}`;

              return (
                <div key={key} className="flex items-center">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={filters.categories[key]}
                    onChange={() => onToggleCategory(key)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    className="flex items-center cursor-pointer group"
                  >
                    <span
                      className={`w-6 h-6 border-2 border-black mr-4 flex items-center justify-center transition-none group-active:scale-90 ${
                        filters.categories[key] ? "bg-black" : ""
                      }`}
                    >
                      {filters.categories[key] && (
                        <span className="material-symbols-outlined text-white text-[18px]">
                          check
                        </span>
                      )}
                    </span>
                    <span className="font-bold tracking-widest text-lg uppercase">
                      {CATEGORY_LABELS[key] ?? key}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-black mb-6 tracking-tighter uppercase border-l-8 border-black pl-4">
            SIZE
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onUpdateSize(size)}
                className={`border-2 border-black py-4 font-bold text-lg hover:bg-black hover:text-white transition-none active:scale-95 ${
                  filters.size === size ? "bg-black text-white" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <div className="opacity-[0.03] select-none pointer-events-none">
          <h3 className="font-display-xl text-[90px] leading-[0.8] tracking-tighter font-black">
            QUEST
            <br />
            HERO
          </h3>
        </div>
      </div>

      <div className="p-6 bg-white border-t-2 border-black fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4">
        <button
          type="button"
          onClick={onClear}
          className="flex-1 py-5 font-bold tracking-widest border-2 border-black hover:bg-black hover:text-white transition-none active:scale-95 uppercase"
        >
          CLEAR ALL
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-[2] py-5 bg-black text-white font-bold tracking-widest hover:bg-white hover:text-black border-2 border-black transition-none active:scale-95 uppercase"
        >
          APPLY FILTERS
        </button>
      </div>
    </div>
  );
}
