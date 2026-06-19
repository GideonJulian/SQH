import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ProductEdit() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "APEX PREDATOR RUNNER",
    price: "245.00",
    category: "FOOTWEAR / PERFORMANCE",
    description:
      "Engineered for the high-intensity side quest. Features a carbon-fiber plate for maximum energy return.",
    sku: "SQH-AP-001",
    stock: 42,
  });

  const [sizes] = useState(["10", "11"]);
  const [color] = useState("PHANTOM BLACK");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ id, form });
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <main className="hidden lg:block ml-64 pt-24 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-12">

            {/* LEFT */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <div className="relative aspect-[4/5] border-2 border-black group">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9fEMUGRhNszt2AiMOjD92sj6zxPFEIAN95R..."
                  alt={form.name}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <div className="bg-white px-6 py-3 font-black uppercase text-xs">
                    REPLACE IMAGE
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 lg:col-span-7 space-y-10">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-b border-black text-2xl font-black uppercase py-3 outline-none"
              />

              <div className="grid grid-cols-2 gap-8">
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="border-b border-black py-2 outline-none"
                />

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="border-b border-black py-2 outline-none"
                />
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border-b border-black py-3 outline-none"
              />

              <div className="grid grid-cols-2 gap-8">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border-b border-black py-2 uppercase font-black"
                >
                  <option>FOOTWEAR / PERFORMANCE</option>
                  <option>APPAREL / CORE</option>
                  <option>EQUIPMENT / QUEST</option>
                </select>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="border-b border-black py-2 outline-none"
                />
              </div>

              <div className="flex gap-4">
                {sizes.map((s) => (
                  <div
                    key={s}
                    className="w-12 h-12 border-2 border-black flex items-center justify-center font-black"
                  >
                    {s}
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-between border-t border-black/10">
                <button className="text-black/40 font-black uppercase">
                  DELETE
                </button>

                <div className="flex gap-4">
                  <button type="button" className="border px-6 py-3 font-black">
                    DISCARD
                  </button>
                  <button type="submit" className="bg-black text-white px-8 py-3 font-black">
                    SAVE
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>

      {/* ================= MOBILE ================= */}
      <main className="lg:hidden pt-20 pb-40 px-5 max-w-md mx-auto bg-white">

        {/* IMAGE SECTION */}
        <section className="mb-10">
          <div className="relative w-full aspect-[4/5] border border-black overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9fEMUGRhNszt2AiMOjD92sj6zxPFEIAN95R..."
              className="w-full h-full object-cover grayscale"
              alt="product"
            />

            <div className="absolute top-4 right-4 bg-black text-white p-2">
              ✎
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square border border-black/10 flex items-center justify-center"
              >
                +
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT IDENTITY */}
        <section className="mb-10 space-y-8">

          <div>
            <label className="text-[10px] uppercase font-black opacity-50">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-b border-black py-2 text-xl font-black outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-black opacity-50">
              Price (USD)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border-b border-black py-2 text-2xl font-black outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-black opacity-50">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border-b border-black py-3 uppercase font-black"
            >
              <option>FOOTWEAR / PERFORMANCE</option>
              <option>APPAREL / CORE</option>
              <option>EQUIPMENT / QUEST</option>
            </select>
          </div>
        </section>

        {/* DETAILS */}
        <section className="mb-10 space-y-8">

          <div>
            <label className="text-[10px] uppercase font-black opacity-50">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-black p-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-black opacity-50">
                SKU
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full border-b border-black py-2"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-black opacity-50">
                Stock Level
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border-b border-black py-2"
              />
            </div>
          </div>
        </section>

        {/* VARIANTS */}
        <section className="mb-10">
          <h3 className="text-xs font-black uppercase mb-4">
            ACTIVE VARIANTS
          </h3>

          <div className="space-y-2">
            {sizes.map((s) => (
              <div
                key={s}
                className="flex justify-between border border-black p-4"
              >
                <span className="font-black">SIZE: {s}</span>
                <span className="text-black/40">| COLOR: {color}</span>
                <span>✕</span>
              </div>
            ))}

            <button className="w-full border-2 border-dashed p-4 font-black uppercase text-xs">
              + ADD VARIANT
            </button>
          </div>
        </section>

        {/* META */}
        <section className="mb-10 p-5 bg-black text-white">
          <div className="font-black uppercase text-xs mb-2">
            HERO SPECIFICATIONS
          </div>
          <p className="text-sm text-white/70">
            This product is tagged as ELITE and appears in premium collection filters.
          </p>
        </section>

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 font-black uppercase"
        >
          Save Changes
        </button>

      </main>
    </>
  );
}