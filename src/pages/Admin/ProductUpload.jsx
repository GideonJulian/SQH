import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, X } from "lucide-react";
import { api, dollarsToCents } from "../../services/api";
import ImageWithFallback from "../../components/ImageWithFallback";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const CATEGORY_MAP = {
  "BASE LAYER": "training",
  OUTERWEAR: "outerwear",
  FOOTWEAR: "footwear",
  ACCESSORIES: "accessories",
};

export default function ProductUpload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "BASE LAYER",
    price: "",
    sizes: ["M", "L"],
    image: null,
    description: "",
    sku: "",
    stock: "",
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSize = (size) => {
    setForm((prev) => {
      const exists = prev.sizes.includes(size);

      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((currentSize) => currentSize !== size)
          : [...prev.sizes, size],
      };
    });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("category", CATEGORY_MAP[form.category]);
      payload.append("price", String(dollarsToCents(form.price)));
      payload.append("description", form.description);
      payload.append("sizes", JSON.stringify(form.sizes));
      if (form.sku) payload.append("sku", form.sku);
      if (form.stock) payload.append("stock", String(Number(form.stock) || 0));
      if (form.image) payload.append("image", form.image);

      await api.post("/admin/products", payload);

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to upload product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-32 text-black lg:ml-64 lg:pb-24">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b-2 border-black bg-white/95 px-4 backdrop-blur-sm lg:left-64 lg:h-auto lg:px-8 lg:py-6">
        <h1 className="text-lg font-black uppercase tracking-tight lg:text-xl">
          New Equipment
        </h1>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center hover:opacity-60"
          >
            <Bell size={21} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center hover:opacity-60"
          >
            <Settings size={21} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Cancel upload"
            onClick={() => navigate("/admin")}
            className="flex h-10 w-10 items-center justify-center hover:opacity-60 lg:hidden"
          >
            <X size={22} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Back to inventory"
            onClick={() => navigate("/admin")}
            className="hidden h-10 w-10 items-center justify-center hover:opacity-60 lg:flex"
          >
            <LogOut size={21} strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-24 lg:px-5 lg:pt-32">
        <form onSubmit={handleSubmit} className="space-y-10 lg:space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                01
              </span>
              <h2 className="text-xl font-black uppercase">Identity</h2>
            </div>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border-b border-black bg-transparent py-3 text-lg font-black uppercase outline-none placeholder:text-black/30"
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="min-w-0 border-b border-black bg-transparent py-3 font-bold uppercase outline-none"
              >
                <option>BASE LAYER</option>
                <option>OUTERWEAR</option>
                <option>FOOTWEAR</option>
                <option>ACCESSORIES</option>
              </select>

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (NGN)"
                className="min-w-0 border-b border-black bg-transparent py-3 font-bold outline-none placeholder:text-black/30"
                required
                type="number"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU (optional)"
                className="min-w-0 border-b border-black bg-transparent py-3 font-bold outline-none placeholder:text-black/30"
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock (optional)"
                className="min-w-0 border-b border-black bg-transparent py-3 font-bold outline-none placeholder:text-black/30"
                type="number"
                min="0"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                02
              </span>
              <h2 className="text-xl font-black uppercase">Attributes</h2>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {SIZE_OPTIONS.map((size) => {
                const active = form.sizes.includes(size);

                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`flex aspect-square min-h-11 items-center justify-center border-2 border-black text-sm font-bold transition sm:h-12 sm:w-12 ${
                      active
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                03
              </span>
              <h2 className="text-xl font-black uppercase">Media</h2>
            </div>

            <label className="block cursor-pointer border-2 border-dashed border-black p-4 text-center sm:p-10">
              <input
                type="file"
                hidden
                onChange={handleImage}
                accept="image/*"
              />
              {preview ? (
                <ImageWithFallback
                  src={preview}
                  alt="Product preview"
                  className="h-72 w-full object-cover sm:h-64"
                />
              ) : (
                <div className="flex min-h-52 items-center justify-center sm:min-h-44">
                  <p className="font-bold uppercase">Upload Product Image</p>
                </div>
              )}
            </label>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                04
              </span>
              <h2 className="text-xl font-black uppercase">Specification</h2>
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Product description..."
              className="w-full resize-y border border-black p-4 outline-none placeholder:text-black/30"
            />
          </section>

          {error && (
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
          )}

          <div className="fixed bottom-16 left-0 right-0 z-30 border-t-2 border-black bg-white p-4 lg:static lg:flex lg:justify-end lg:border-0 lg:p-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black px-10 py-5 font-bold uppercase text-white disabled:opacity-50 lg:w-auto"
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
