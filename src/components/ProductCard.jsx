export default function ProductCard({ product }) {
  return (
    <div className="group">
      <div className="aspect-[4/5] bg-surface-container mb-6 overflow-hidden relative">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={product.src}
          alt={product.title}
        />

        {product.badge && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-label-bold text-[10px] tracking-widest uppercase">
            {product.badge}
          </div>
        )}
      </div>

      <h3 className="font-body-lg font-bold uppercase tracking-tight">
        {product.title}
      </h3>

      <p className="font-price-display text-price-display">
        {product.price}
      </p>
    </div>
  );
}