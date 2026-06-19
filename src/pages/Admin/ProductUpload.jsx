import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductUpload() {
  const navigate = useNavigate();

  // FORM STATE (easy to connect to API later)
  const [form, setForm] = useState({
    name: "",
    category: "BASE LAYER",
    price: "",
    sizes: ["M", "L"],
    image: null,
    description: "",
  });

  const [preview, setPreview] = useState(null);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SIZE TOGGLE
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

  // IMAGE UPLOAD (API-ready)
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // SUBMIT (PLACEHOLDER FOR API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👉 THIS IS WHERE YOU PLUG YOUR API
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("category", form.category);
    payload.append("price", form.price);
    payload.append("description", form.description);
    payload.append("sizes", JSON.stringify(form.sizes));
    if (form.image) payload.append("image", form.image);

    console.log("UPLOAD PAYLOAD:", Object.fromEntries(payload));

    // Example API later:
    // await fetch("/api/products", { method: "POST", body: payload });

    alert("Product ready for API upload 🚀");
    navigate("/admin");
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
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border-b border-black bg-transparent py-3 text-lg font-black uppercase outline-none"
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
              <input type="file" hidden onChange={handleImage} />
              {preview ? (
                <img
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

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black px-10 py-5 font-bold uppercase text-white"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}