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
  onUpdatePriceRange,
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePriceChange = (key, value) => {
    onUpdatePriceRange({
      ...filters.priceRange,
      [key]: Number(value),
    });
  };

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

        <section>
          <h2 className="text-xl font-black text-black mb-6 tracking-tighter uppercase border-l-8 border-black pl-4">
            PRICE RANGE
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="mobile-min-price"
                className="block font-bold text-[10px] tracking-widest mb-1"
              >
                MIN USD
              </label>
              <input
                id="mobile-min-price"
                className="w-full border-b-2 border-black bg-transparent py-2 text-2xl font-black focus:border-b-4 outline-none transition-all placeholder:text-black/20"
                min="0"
                max={filters.priceRange.max}
                value={filters.priceRange.min}
                onChange={(event) =>
                  handlePriceChange("min", event.target.value)
                }
                type="number"
              />
            </div>

            <div className="w-4 h-0.5 bg-black mt-4" />

            <div className="flex-1">
              <label
                htmlFor="mobile-max-price"
                className="block font-bold text-[10px] tracking-widest mb-1"
              >
                MAX USD
              </label>
              <input
                id="mobile-max-price"
                className="w-full border-b-2 border-black bg-transparent py-2 text-2xl font-black focus:border-b-4 outline-none transition-all placeholder:text-black/20"
                min={filters.priceRange.min}
                max="500"
                value={filters.priceRange.max}
                onChange={(event) =>
                  handlePriceChange("max", event.target.value)
                }
                type="number"
              />
            </div>
          </div>

          <div className="mt-8 relative h-1 bg-black/10">
            <div className="absolute left-0 right-1/4 h-full bg-black" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-black border-2 border-white" />
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-6 h-6 bg-black border-2 border-white" />
          </div>
        </section>

        <div className="opacity-[0.03] select-none pointer-events-none">
          <h3 className="font-display-xl text-[120px] leading-[0.8] tracking-tighter font-black">
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
