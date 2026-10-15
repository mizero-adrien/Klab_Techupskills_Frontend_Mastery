import { useSearchParams } from "react-router";
import ProductCard from "../components/Home/ProductCard";
import { products } from "../data/Home";

const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const query = (searchParams.get("q") ?? "").trim();

  const visible = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const search = query.toLowerCase();
    const matchesQuery =
      search === "" ||
      p.name.toLowerCase().includes(search) ||
      p.category.includes(search);
    return matchesCategory && matchesQuery;
  });

  const selectCategory = (c: string) => {
    const next = new URLSearchParams(searchParams);
    if (c === "all") next.delete("category");
    else next.set("category", c);
    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        {query ? `Results for "${query}"` : "All products"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {visible.length} {visible.length === 1 ? "product" : "products"}
        {query && (
          <>
            {" · "}
            <button
              type="button"
              onClick={clearSearch}
              className="font-medium text-brand hover:underline"
            >
              Clear search
            </button>
          </>
        )}
      </p>

      <div className="mb-6 mt-4 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => selectCategory(c)}
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
          {query
            ? `Nothing matches "${query}". Check the spelling or try a shorter word.`
            : "No products in this category yet."}
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