import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit3,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import { api, formatPriceCents } from "../../services/api";
import { logoutAdmin } from "../../utils/adminAuth";
import ImageWithFallback from "../../components/ImageWithFallback";

const categoryLabels = {
  outerwear: "Outerwear",
  training: "Training Bases",
  accessories: "Accessories",
  footwear: "Footwear",
};

const categories = ["all", "outerwear", "training", "accessories", "footwear"];

export default function ProductListing() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);
        const response = await api.get("/admin/products?limit=100");
        setInventory(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const filteredInventory = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return inventory.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const searchableText = [
        product.title,
        product.sku,
        product.category,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedSearch);
    });
  }, [activeCategory, searchQuery, inventory]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b-2 border-black bg-white px-5 py-4 lg:left-64 lg:px-8">
        <div className="lg:hidden">
          <span className="text-xl font-black italic uppercase tracking-tight">
            SQH Admin
          </span>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-black/40">
            Inventory Management /
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-black">
            All Items
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            aria-label="Notifications"
            className="hover:opacity-60"
            type="button"
          >
            <Bell size={22} />
          </button>
          <button
            aria-label="Settings"
            className="hover:opacity-60"
            type="button"
          >
            <Settings size={22} />
          </button>
          <button
            aria-label="Logout"
            className="hidden hover:opacity-60 lg:block"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <main className="px-5 pb-32 pt-24 lg:ml-64 lg:px-12 lg:pb-16">
        <section className="relative mb-10 lg:mb-12">
          <span className="pointer-events-none absolute -left-6 -top-10 hidden select-none text-[120px] font-black uppercase leading-none text-black/[0.03] lg:block">
            Quest
          </span>
          <h1 className="relative z-10 mb-4 max-w-4xl text-4xl font-black uppercase leading-none tracking-normal md:text-6xl lg:text-7xl">
            Equipment Inventory
          </h1>
          <div className="h-2 w-24 bg-black lg:h-2" />
        </section>

        <section className="mb-8 border-black pb-8 lg:flex lg:items-end lg:justify-between lg:gap-6 lg:border-b-2">
          <div className="mb-6 flex gap-3 overflow-x-auto whitespace-nowrap pb-1 lg:mb-0 lg:flex-wrap">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  className={`border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors lg:px-6 ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  {category === "all" ? "All Items" : categoryLabels[category]}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full max-w-sm">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 text-black lg:left-auto lg:right-0"
              size={20}
            />
            <input
              aria-label="Search inventory"
              className="w-full border-0 border-b-2 border-black bg-transparent py-3 pl-8 pr-0 text-xs font-black uppercase tracking-widest outline-none placeholder:text-black/30 lg:pl-0 lg:pr-8"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search assets..."
              type="search"
              value={searchQuery}
            />
          </label>
        </section>

        {loading && (
          <p className="text-xs font-black uppercase tracking-widest">Loading inventory...</p>
        )}

        {error && (
          <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="hidden w-full overflow-x-auto lg:block">
              <table className="w-full min-w-[780px] border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-left">
                    <th className="w-20 pb-4 pt-2 text-xs font-black uppercase text-black/40">
                      Item
                    </th>
                    <th className="pb-4 pt-2 text-xs font-black uppercase">
                      Product Name
                    </th>
                    <th className="pb-4 pt-2 text-xs font-black uppercase">
                      Price
                    </th>
                    <th className="pb-4 pt-2 text-right text-xs font-black uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredInventory.map((product) => (
                    <tr
                      className="transition-colors hover:bg-black/[0.02]"
                      key={product.id}
                    >
                      <td className="py-6">
                        <div className="h-20 w-16 overflow-hidden border border-black/5 bg-black/5">
                          <ImageWithFallback
                            alt={product.title}
                            className="h-full w-full object-cover grayscale"
                            src={product.image}
                          />
                        </div>
                      </td>
                      <td className="py-6">
                        <p className="text-lg font-bold uppercase leading-tight">
                          {product.title}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-black/40">
                          Cat: {categoryLabels[product.category]} / SKU:{" "}
                          {product.sku || "N/A"}
                        </p>
                      </td>
                      <td className="py-6">
                        <p className="text-2xl font-black tabular-nums">
                          {formatPriceCents(product.price)}
                        </p>
                      </td>
                      <td className="py-6 text-right">
                        <button
                          className="inline-flex items-center gap-2 border-b border-black text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-50"
                          type="button"
                          onClick={() => navigate(`/admin/edit/${product.id}`)}
                        >
                          Edit
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-black lg:hidden">
              {filteredInventory.map((product) => (
                <div
                  className="flex items-center justify-between gap-4 border-b-2 border-black bg-white py-6"
                  key={product.id}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden bg-black/5">
                      <img
                        alt={product.title}
                        className="h-full w-full object-cover grayscale"
                        src={product.image}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-widest">
                        {product.title}
                      </p>
                      <p className="mt-2 text-xl font-black tabular-nums">
                        {formatPriceCents(product.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="shrink-0 border-2 border-black bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
                    type="button"
                    onClick={() => navigate(`/admin/edit/${product.id}`)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            {filteredInventory.length === 0 && (
              <div className="border-y-2 border-black py-16 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-black/50">
                  No inventory items found
                </p>
              </div>
            )}

            <footer className="mt-12 hidden items-center justify-between border-t-2 border-black pt-8 lg:flex">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">
                Showing {filteredInventory.length} of {inventory.length} items
              </p>
              <div className="flex gap-2">
                <button
                  aria-label="Previous page"
                  className="flex h-10 w-10 items-center justify-center border border-black transition-colors hover:bg-black hover:text-white"
                  type="button"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center border border-black bg-black text-sm font-black text-white"
                  type="button"
                >
                  1
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center border border-black text-sm font-black transition-colors hover:bg-black hover:text-white"
                  type="button"
                >
                  2
                </button>
                <button
                  aria-label="Next page"
                  className="flex h-10 w-10 items-center justify-center border border-black transition-colors hover:bg-black hover:text-white"
                  type="button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
