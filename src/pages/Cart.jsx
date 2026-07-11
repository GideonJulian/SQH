import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getPriceValue } from "../utils/prices";
import ImageWithFallback from "../components/ImageWithFallback";

function formatPrice(value) {
  return `₦${value.toFixed(2)}`;
}
const Cart = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="pt-28 max-w-[1440px] mx-auto px-6 md:px-8 min-h-screen pb-32">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        <div className="w-full md:w-2/3">
          <div className="mb-12 relative">
            <span className="absolute -top-8 -left-4 text-[96px] md:text-[120px] font-black text-black/5 select-none leading-none z-0">
              SQH
            </span>

            <h1 className="text-3xl font-black uppercase relative z-10 tracking-tight">
              Your Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="border-y-2 border-black py-16">
              <p className="text-sm font-bold uppercase tracking-widest text-black/60">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col border-t-2 border-black">
              {items.map((item) => {
                const itemTotal = getPriceValue(item.price) * item.quantity;

                return (
                  <div
                    key={item.key}
                    className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 py-6 border-b border-black/30 group md:grid-cols-[160px_minmax(0,1fr)] md:gap-8 md:py-8"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="block aspect-[4/5] bg-zinc-100 overflow-hidden"
                      aria-label={`View ${item.title}`}
                    >
                      <ImageWithFallback
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={item.image || item.src}
                        alt={item.title}
                      />
                    </Link>

                    <div className="min-w-0 flex flex-col">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <Link to={`/product/${item.id}`} className="min-w-0">
                            <h3 className="text-lg font-black uppercase leading-tight md:text-2xl md:leading-none">
                              {item.title}
                            </h3>
                          </Link>

                          <span className="hidden text-xl font-black md:block md:text-2xl">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-black/50 uppercase tracking-widest text-[10px] font-bold md:text-xs">
                            Size: {item.size}
                          </p>

                          <p className="text-black/50 uppercase tracking-widest text-[10px] font-bold md:text-xs">
                            {item.category || "SQH"}
                          </p>

                          <span className="block text-lg font-black md:hidden">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 hidden items-center gap-3 md:mt-8 md:flex">
                        <div className="flex h-10 items-center border border-black md:h-12">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            className="flex h-full items-center px-3 transition-colors duration-200 hover:bg-black hover:text-white md:px-4"
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-4 font-bold md:px-6">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            className="flex h-full items-center px-3 transition-colors duration-200 hover:bg-black hover:text-white md:px-4"
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="grid size-10 place-items-center border border-black text-xs font-bold uppercase tracking-widest transition-all hover:border-red-600 hover:text-red-600 md:size-auto md:border-0 md:border-b md:border-black md:pb-1"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 size={18} className="md:hidden" />
                          <span className="hidden md:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 mt-1 flex items-center gap-3 md:hidden">
                      <div className="flex h-10 items-center border border-black">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          className="flex h-full items-center px-3 transition-colors duration-200 hover:bg-black hover:text-white"
                          aria-label={`Decrease ${item.title} quantity`}
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 font-bold md:px-6">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          className="flex h-full items-center px-3 transition-colors duration-200 hover:bg-black hover:text-white"
                          aria-label={`Increase ${item.title} quantity`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="grid size-10 place-items-center border border-black text-xs font-bold uppercase tracking-widest transition-all hover:border-red-600 hover:text-red-600"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12">
            <Link
              className="inline-flex items-center font-bold text-xs uppercase hover:tracking-[0.2em] transition-all duration-300"
              to="/shop"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-white border-2 border-black p-6 md:p-8 sticky top-28">
            <h2 className="text-3xl font-black uppercase mb-8">
              Order Summary
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between text-black/65">
                <span className="uppercase tracking-widest text-xs font-bold">
                  Subtotal
                </span>
                <span className="font-black text-lg">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-black/65">
                <span className="uppercase tracking-widest text-xs font-bold">
                  Shipping
                </span>
                <span className="font-black text-lg">Free</span>
              </div>

              <div className="flex justify-between text-black/65 gap-4">
                <span className="uppercase tracking-widest text-xs font-bold">
                  Taxes
                </span>
                <span className="font-black text-sm text-right">
                  Calculated at Checkout
                </span>
              </div>

              <div className="border-t-2 border-black pt-6 mt-6 flex justify-between items-end">
                <span className="text-3xl font-black uppercase">Total</span>
                <span className="text-[40px] font-black leading-none">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                aria-disabled={items.length === 0}
                className={`block w-full bg-black text-white py-4 text-center font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all duration-300 active:scale-95 mt-8 ${
                  items.length === 0 ? "opacity-40 pointer-events-none" : ""
                }`}
                tabIndex={items.length === 0 ? -1 : undefined}
                to="/checkout"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
