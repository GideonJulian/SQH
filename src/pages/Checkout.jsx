import { useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { getPriceValue } from "../utils/prices";
import { api } from "../services/api";
import ImageWithFallback from "../components/ImageWithFallback";

const CURRENCIES = [
  { code: "NGN", label: "NGN — Nigerian Naira" },
  { code: "USD", label: "USD — US Dollar" },
];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { currency, setCurrency, ngnPerUsd } = useCurrency();
  const navigate = useNavigate();

  const total = subtotal;

  function formatPrice(ngnValue) {
    if (currency === "USD" && ngnPerUsd) {
      return `$${(ngnValue / ngnPerUsd).toFixed(2)}`;
    }
    return `₦${ngnValue.toFixed(2)}`;
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) return;

    setError("");
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: form.name,
          email: form.email,
        },
        shippingAddress: {
          line1: form.address,
          city: form.city,
          postalCode: form.zip,
          country: form.country,
        },
        items: items.map((item) => ({
          productId: item.id,
          size: item.size,
          quantity: item.quantity,
        })),
        currency,
      };

      const orderResponse = await api.post("/orders", orderPayload);
      const order = orderResponse.data;

      const paymentResponse = await api.post(`/orders/${order.id}/payment-intent`);
      const payment = paymentResponse.data;

      clearCart();

      if (payment.authorizationUrl) {
        window.location.href = payment.authorizationUrl;
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black md:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative mb-12 overflow-hidden">
          <Link
            className="mb-8 inline-flex items-center text-xs font-black uppercase tracking-widest text-black/60 transition-all duration-300 hover:text-black hover:tracking-[0.2em]"
            to="/cart"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Cart
          </Link>

          <h1 className="relative z-10 text-5xl font-black uppercase leading-none tracking-tight md:text-7xl lg:text-8xl">
            Checkout
          </h1>

          <div className="pointer-events-none absolute -bottom-8 left-24 select-none text-[18vw] font-black leading-none text-black/5 md:left-40">
            HERO
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-16 lg:col-span-7">
            <section>
              <div className="mb-8 flex items-center gap-4">
                <span className="bg-black px-3 py-1 text-xs font-bold text-white">
                  01
                </span>
                <h2 className="text-3xl font-black uppercase md:text-4xl">
                  Shipping
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest text-black/60"
                    htmlFor="checkout-name"
                  >
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-name"
                    name="name"
                    onChange={handleChange}
                    placeholder="ALEX MERCER"
                    type="text"
                    value={form.name}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    htmlFor="checkout-email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-email"
                    name="email"
                    onChange={handleChange}
                    placeholder="ALEX.M@SIDEQUEST.HERO"
                    type="email"
                    value={form.email}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    htmlFor="checkout-address"
                  >
                    Street Address
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-address"
                    name="address"
                    onChange={handleChange}
                    placeholder="777 DISCIPLINE BOULEVARD"
                    type="text"
                    value={form.address}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    htmlFor="checkout-city"
                  >
                    City
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-city"
                    name="city"
                    onChange={handleChange}
                    placeholder="NEW YORK"
                    type="text"
                    value={form.city}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    htmlFor="checkout-zip"
                  >
                    Zip Code
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-zip"
                    name="zip"
                    onChange={handleChange}
                    placeholder="10001"
                    type="text"
                    value={form.zip}
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    htmlFor="checkout-country"
                  >
                    Country
                  </label>
                  <input
                    className="w-full rounded-none border-0 border-b border-black bg-transparent px-0 py-2 text-base font-semibold uppercase placeholder:text-black/30 focus:border-b-2 focus:outline-none"
                    id="checkout-country"
                    name="country"
                    onChange={handleChange}
                    placeholder="US"
                    type="text"
                    value={form.country}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-8 flex items-center gap-4">
                <span className="bg-black px-3 py-1 text-xs font-bold text-white">
                  02
                </span>
                <h2 className="text-3xl font-black uppercase md:text-4xl">
                  Review Items
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="border-y-2 border-black py-12">
                  <p className="text-xs font-black uppercase tracking-widest text-black/60">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemTotal = getPriceValue(item.price) * item.quantity;

                    return (
                      <div
                        className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border border-black/5 bg-[#F5F5F5] p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                        key={item.key}
                      >
                        <div className="h-28 w-20 flex-shrink-0 bg-zinc-100 sm:h-32 sm:w-24">
                          <ImageWithFallback
                            alt={item.title}
                            className="h-full w-full object-cover grayscale"
                            src={item.image || item.src}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="mb-1 text-sm font-black uppercase tracking-tight sm:text-base">
                            {item.title}
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">
                            Size: {item.size} / Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="col-span-2 text-xl font-black sm:col-span-1 sm:text-right">
                          {formatPrice(itemTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-8 border-2 border-black bg-white p-6 md:p-8">
              <h2 className="mb-8 text-3xl font-black uppercase md:text-4xl">
                Order Summary
              </h2>

              <div className="mb-8">
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-widest text-black/60"
                  htmlFor="checkout-currency"
                >
                  Pay In
                </label>
                <div className="relative">
                  <select
                    className="w-full cursor-pointer appearance-none border-2 border-black bg-white px-4 py-3 text-sm font-black uppercase tracking-widest focus:outline-none"
                    id="checkout-currency"
                    name="currency"
                    onChange={(e) => setCurrency(e.target.value)}
                    value={currency}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-tight text-black/40">
                  Prices shown in {currency}. You'll be charged this amount at checkout.
                </p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-xl font-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest">
                    Shipping
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-green-600">
                    Free
                  </span>
                </div>
              </div>

              <div className="mb-10 flex items-center justify-between gap-4">
                <span className="text-3xl font-black uppercase">Total</span>
                <span className="text-3xl font-black">{formatPrice(total)}</span>
              </div>

              {error && (
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-red-600">
                  {error}
                </p>
              )}

              <button
                className="w-full border-2 border-black bg-black py-5 text-base font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none md:py-6 md:text-lg"
                disabled={items.length === 0 || isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {isSubmitting ? "Processing..." : "Complete Purchase"}
              </button>

              <div className="mt-8 flex items-start gap-3 text-black/40">
                <LockKeyhole size={16} fill="currentColor" />
                <p className="text-[10px] font-bold uppercase leading-tight tracking-tight">
                  Secure transaction. 256-bit encryption active. All sales final
                  on performance gear to ensure protocol integrity.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;