"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((item) => String(item.id) === productId);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(
    () => products.filter((item) => item.id !== product?.id).slice(0, 4),
    [product],
  );

  useEffect(() => {
    setSelectedSize(product?.sizes?.[0] || "");
    setQuantity(1);
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen max-w-[1440px] mx-auto px-6 md:px-8 pt-28 pb-32">
        <div className="border-2 border-black p-10 text-center">
          <h1 className="text-3xl font-black uppercase">Product not found</h1>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const price =
    typeof product.price === "number"
      ? `$${product.price.toFixed(2)}`
      : product.price;

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-8 pt-28 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="relative group">
          <div className="bg-zinc-100 aspect-[4/5] overflow-hidden flex items-center justify-center">
            <img
              alt={product.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              src={product.src}
            />
          </div>

          <div className="absolute top-6 left-6 w-12 h-12 bg-black flex items-center justify-center">
            <span className="text-white font-black text-xs tracking-widest">
              SQH
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <nav className="flex gap-2 text-black/45 font-bold uppercase text-[10px] tracking-widest mb-4">
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>{product.category || "Apparel"}</span>
            <span>/</span>
            <span className="text-black">{product.title}</span>
          </nav>

          <h1 className=" font-black text-black uppercase mb-8 leading-none tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="  font-black text-black">
              {price}
            </span>
            <span className="text-black/40 font-bold line-through">
              $180.00
            </span>
          </div>

          <p className="text-black/65 max-w-md mb-10">
            Engineered for the disciplined. A heavy-weight technical build
            designed to endure high-intensity training while maintaining an
            editorial silhouette. Discipline is freedom.
          </p>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase text-xs">Select Size</span>
              <button
                type="button"
                className="font-bold uppercase text-[10px] underline"
              >
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`border-2 border-black py-4 font-bold uppercase text-sm transition-all ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center border-2 border-black h-16 w-full md:w-48">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex-1 h-full flex items-center justify-center font-bold hover:bg-zinc-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={20} />
              </button>

              <div className="flex-1 h-full flex items-center justify-center font-bold border-x-2 border-black">
                {String(quantity).padStart(2, "0")}
              </div>

              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex-1 h-full flex items-center justify-center font-bold hover:bg-zinc-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              type="button"
              className="w-full bg-black text-white h-16 font-bold uppercase tracking-widest text-lg hover:bg-white hover:text-black border-2 border-black transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              Add to Cart
            </button>
          </div>

          <div className="mt-16 border-t-2 border-black">
            <button
              type="button"
              className="w-full py-4 border-b-2 border-black flex justify-between items-center cursor-pointer"
            >
              <span className="font-bold uppercase text-sm">Fabric & Care</span>
              <ChevronDown size={22} />
            </button>
          </div>
        </div>
      </div>

      <section className="mt-32 relative">
        <div className="font-black text-black/5 absolute -top-14 left-0 text-[13vw] uppercase leading-none select-none pointer-events-none">
          Equipment
        </div>

        <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Complete the Set
          </h2>
          <Link
            to="/shop"
            className="font-bold uppercase text-xs tracking-widest hover:tracking-[0.2em] transition-all"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
