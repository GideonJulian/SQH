"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import MobileFilterOverlay from "../components/MobileFilterOverlay";
import ProductCard from "../components/ProductCard";
import { api } from "../services/api";
import { getPriceValue } from "../utils/prices";

const ITEMS_PER_PAGE = 6;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const DEFAULT_FILTERS = {
  categories: {
    outerwear: false,
    training: false,
    accessories: false,
    footwear: false,
  },
  size: "",
  priceRange: {
    min: 0,
    max: 500,
  },
};

export default function Shop() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("NEWEST ARRIVALS");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await api.get("/products?limit=100");
        setProducts(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const selectedCategories = Object.entries(filters.categories)
      .filter(([, isSelected]) => isSelected)
      .map(([category]) => category);

    let result = products.filter((product) => {
      const searchableText = [
        product.title,
        product.category,
        product.badge,
        ...(product.sizes || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesSize =
        !filters.size || product.sizes?.includes(filters.size);

      const priceInDollars = getPriceValue(product.price);
      const matchesPrice =
        priceInDollars >= filters.priceRange.min &&
        priceInDollars <= filters.priceRange.max;

      return matchesSearch && matchesCategory && matchesSize && matchesPrice;
    });

    if (sort === "PRICE: LOW TO HIGH") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "PRICE: HIGH TO LOW") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "BEST SELLERS") {
      result = [...result].sort(
        (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)),
      );
    }

    return result;
  }, [filters, searchQuery, sort, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredProducts]);

  const toggleCategory = (key) => {
    setFilters((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: !prev.categories[key],
      },
    }));
    setPage(1);
  };

  const updateSize = (size) => {
    setFilters((prev) => ({
      ...prev,
      size: prev.size === size ? "" : size,
    }));
    setPage(1);
  };

  const updatePriceRange = (nextRange) => {
    const min = Math.max(0, Number(nextRange.min) || 0);
    const max = Math.min(500, Number(nextRange.max) || 0);

    setFilters((prev) => ({
      ...prev,
      priceRange: {
        min: Math.min(min, max),
        max: Math.max(min, max),
      },
    }));
    setPage(1);
  };

  const updateSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setPage(1);
  };

  if (loading) {
    return (
      <main className="relative min-h-screen max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pt-20">
        <p className="text-xs font-black uppercase tracking-widest">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pt-20">
        <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pt-20">
      <header className="md:hidden border-b-2 border-black pb-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="font-black uppercase text-2xl">SQH_QUEST</h1>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="border-2 border-black px-4 py-2 text-xs uppercase font-bold"
          >
            FILTER
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={18}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => updateSearchQuery(event.target.value)}
            className="w-full border-b-2 border-black bg-transparent py-3 pl-8 pr-10 text-sm font-bold uppercase tracking-widest outline-none placeholder:text-black/30"
            placeholder="Search products"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => updateSearchQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <section className="hidden md:flex mb-12 flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase">The Collection</h1>
          <p className="text-sm opacity-60 max-w-xl mt-2">
            Performance-engineered equipment built for discipline and
            progression.
          </p>
        </div>

        <div className="flex items-end gap-6">
          <div className="relative w-72">
            <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">
              Search
            </label>
            <Search
              size={18}
              className="absolute left-0 bottom-2.5 text-black"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => updateSearchQuery(event.target.value)}
              className="w-full border-b-2 border-black bg-transparent py-2 pl-8 pr-8 text-xs uppercase font-bold outline-none placeholder:text-black/30"
              placeholder="Product, category, size"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateSearchQuery("")}
                className="absolute right-0 bottom-2.5"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <label className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest opacity-60">
              Sort:
            </span>

            <select
              value={sort}
              onChange={(event) => updateSort(event.target.value)}
              className="border-b-2 border-black bg-transparent text-xs uppercase font-bold px-3 py-2"
            >
              <option>NEWEST ARRIVALS</option>
              <option>PRICE: HIGH TO LOW</option>
              <option>PRICE: LOW TO HIGH</option>
              <option>BEST SELLERS</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="hidden md:block w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-xs uppercase font-bold border-b pb-2 mb-4">
              Category
            </h3>

            <div className="space-y-3">
              {Object.keys(filters.categories).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories[key]}
                    onChange={() => toggleCategory(key)}
                  />
                  <span className="text-xs uppercase font-bold">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold border-b pb-2 mb-4">
              Size
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateSize(size)}
                  className={`border py-2 text-xs font-bold ${
                    filters.size === size ? "bg-black text-white" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold border-b pb-2 mb-4">
              Price
            </h3>

            <input
              type="range"
              min="0"
              max="500"
              value={filters.priceRange.max}
              onChange={(event) =>
                updatePriceRange({
                  ...filters.priceRange,
                  max: event.target.value,
                })
              }
              className="w-full"
            />

            <div className="flex justify-between text-xs mt-2">
              <span>${filters.priceRange.min}</span>
              <span>Up to ${filters.priceRange.max}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="w-full border-2 border-black py-3 text-xs uppercase font-bold hover:bg-black hover:text-white"
          >
            Clear Filters
          </button>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {paginatedProducts.length === 0 && (
            <div className="border border-dashed border-black/30 py-16 text-center mt-10">
              <p className="text-xs uppercase font-bold tracking-widest">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products found"}
              </p>
            </div>
          )}

          <div className="mt-14 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prevPage) => prevPage - 1)}
              className="w-10 h-10 border-2 border-black disabled:opacity-30"
            >
              &larr;
            </button>

            <span className="text-xs font-bold">
              {page} / {totalPages || 1}
            </span>

            <button
              type="button"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="w-10 h-10 border-2 border-black disabled:opacity-30"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <MobileFilterOverlay
          filters={filters}
          onClose={() => setMobileFiltersOpen(false)}
          onApply={() => setMobileFiltersOpen(false)}
          onClear={clearFilters}
          onToggleCategory={toggleCategory}
          onUpdateSize={updateSize}
        />
      )}
    </main>
  );
}
