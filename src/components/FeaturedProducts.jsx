import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function FeaturedProducts() {
  return (
    <section className="py-24 px-8 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="font-label-bold text-label-bold uppercase tracking-widest text-black/50 mb-2 block">
            NEW DROPS
          </span>
          <h2 className="font-headline-lg text-headline-lg uppercase">
            THE ELITE LINE
          </h2>
        </div>

        <a className="font-label-bold uppercase border-b-2 border-black pb-1 hover:tracking-widest transition-all">
          VIEW ALL PRODUCTS
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}