import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, dollarsToCents } from "../../services/api";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    sku: "",
    stock: "",
    isActive: true,
  });
  const [sizes, setSizes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data;
        setProduct(data);
        setForm({
          title: data.title,
          price: (data.price / 100).toFixed(2),
          category: data.category,
          description: data.description || "",
          sku: data.sku || "",
          stock: String(data.stock ?? 0),
          isActive: data.isActive ?? true,
        });
        setSizes(data.sizes || []);
        setImagePreview(data.image || data.images?.[0]?.url || "");
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        price: dollarsToCents(form.price),
        category: form.category,
        description: form.description,
        sku: form.sku || null,
        stock: Number(form.stock) || 0,
        sizes,
        isActive: form.isActive,
      };

      await api.patch(`/admin/products/${id}`, payload);

      if (imageFile) {
        const imagePayload = new FormData();
        imagePayload.append("image", imageFile);
        imagePayload.append("isPrimary", "true");
        await api.post(`/admin/products/${id}/images`, imagePayload);
      }

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <main className="ml-64 min-h-screen pt-24 px-8">
        <p className="text-xs font-black uppercase tracking-widest">Loading product...</p>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="ml-64 min-h-screen pt-24 px-8">
        <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
      </main>
    );
  }

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
                  src={imagePreview}
                  alt={form.title}
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer">
                  <input type="file" hidden onChange={handleImage} accept="image/*" />
                  <div className="bg-white px-6 py-3 font-black uppercase text-xs">
                    REPLACE IMAGE
                  </div>
                </label>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 lg:col-span-7 space-y-10">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border-b border-black text-2xl font-black uppercase py-3 outline-none"
              />

              <div className="grid grid-cols-2 gap-8">
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="SKU"
                  className="border-b border-black py-2 outline-none"
                />

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price (USD)"
                  className="border-b border-black py-2 outline-none"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
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
                  <option value="outerwear">OUTERWEAR</option>
                  <option value="training">TRAINING</option>
                  <option value="accessories">ACCESSORIES</option>
                  <option value="footwear">FOOTWEAR</option>
                </select>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="border-b border-black py-2 outline-none"
                  min="0"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black transition ${
                      sizes.includes(size) ? "bg-black text-white" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <span className="text-xs font-black uppercase tracking-widest">Active</span>
              </label>

              {error && (
                <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
              )}

              <div className="pt-6 flex justify-between border-t border-black/10">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-black/40 font-black uppercase hover:text-red-600"
                >
                  DELETE
                </button>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="border px-6 py-3 font-black"
                  >
                    DISCARD
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-8 py-3 font-black disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : "SAVE"}
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
              src={imagePreview}
              className="w-full h-full object-cover grayscale"
              alt="product"
            />

            <label className="absolute top-4 right-4 bg-black text-white p-2 cursor-pointer">
              <input type="file" hidden onChange={handleImage} accept="image/*" />
              ✎
            </label>
          </div>
        </section>

        {/* PRODUCT IDENTITY */}
        <section className="mb-10 space-y-8">
          <div>
            <label className="text-[10px] uppercase font-black opacity-50">
              Product Name
            </label>
            <input
              name="title"
              value={form.title}
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
              type="number"
              step="0.01"
              min="0"
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
              <option value="outerwear">OUTERWEAR</option>
              <option value="training">TRAINING</option>
              <option value="accessories">ACCESSORIES</option>
              <option value="footwear">FOOTWEAR</option>
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
                min="0"
              />
            </div>
          </div>
        </section>

        {/* VARIANTS */}
        <section className="mb-10">
          <h3 className="text-xs font-black uppercase mb-4">
            ACTIVE SIZES
          </h3>

          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black transition ${
                  sizes.includes(size) ? "bg-black text-white" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <label className="flex items-center gap-3 mb-10">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <span className="text-xs font-black uppercase tracking-widest">Active</span>
        </label>

        {error && (
          <p className="mb-6 text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-black text-white py-4 font-black uppercase disabled:opacity-50"
        >
          {saving ? "SAVING..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-4 w-full border-2 border-red-600 text-red-600 py-4 font-black uppercase"
        >
          Delete Product
        </button>
      </main>
    </>
  );
}
