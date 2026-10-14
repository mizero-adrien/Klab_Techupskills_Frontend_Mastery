import { useSearchParams } from "react-router";
import ProductCard from "../components/Home/ProductCard";
import { products } from "../data/Home";

const categories = ["all", "mobile", "watches", "electronics", "furniture"];

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";

  const visible =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  const select = (c: string) => {
    if (c === "all") setSearchParams({});
    else setSearchParams({ category: c });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold text-slate-800">
        {category === "all" ? "All products" : `Products: ${category}`}
      </h1>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => select(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              c === category
                ? "bg-brand text-white"
                : "bg-brand-soft text-slate-700 hover:text-brand"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} deal={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;