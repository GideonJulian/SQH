import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
          ? prev.sizes.filter((s) => s !== size)
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
    <main className="ml-64 min-h-screen pb-24">
      {/* TOP BAR */}
      <header className="fixed top-0 right-0 left-64 z-40 flex items-center justify-between border-b-2 border-black bg-white/90 px-8 py-6 backdrop-blur-sm">
        <h1 className="text-xl font-black uppercase tracking-tight">
          NEW EQUIPMENT
        </h1>

        <div className="flex gap-4">
          <button type="button">🔔</button>
          <button type="button">⚙️</button>
          <button type="button">⎋</button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto mt-32 max-w-4xl px-5">
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* 01 IDENTITY */}
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
              className="w-full border-b border-black bg-transparent py-3 text-lg font-black uppercase outline-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border-b border-black bg-transparent py-3 font-bold uppercase outline-none"
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
                placeholder="Price (USD)"
                className="border-b border-black bg-transparent py-3 font-bold outline-none"
                required
                type="number"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU (optional)"
                className="border-b border-black bg-transparent py-3 font-bold outline-none"
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock (optional)"
                className="border-b border-black bg-transparent py-3 font-bold outline-none"
                type="number"
                min="0"
              />
            </div>
          </section>

          {/* 02 ATTRIBUTES */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                02
              </span>
              <h2 className="text-xl font-black uppercase">Attributes</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {SIZE_OPTIONS.map((size) => {
                const active = form.sizes.includes(size);

                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`h-12 w-12 border-2 font-bold transition ${
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

          {/* 03 MEDIA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                03
              </span>
              <h2 className="text-xl font-black uppercase">Media</h2>
            </div>

            <label className="block cursor-pointer border-2 border-dashed border-black p-10 text-center">
              <input
                type="file"
                hidden
                onChange={handleImage}
                accept="image/*"
              />
              {preview ? (
                <ImageWithFallback
                  src={preview}
                  alt="preview"
                  className="h-64 w-full object-cover"
                />
              ) : (
                <p className="font-bold uppercase">Upload Product Image</p>
              )}
            </label>
          </section>

          {/* 04 DESCRIPTION */}
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
              className="w-full border border-black p-4 outline-none"
            />
          </section>

          {error && (
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
          )}

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black px-10 py-5 font-bold uppercase text-white disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
