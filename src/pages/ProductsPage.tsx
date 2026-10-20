import { useSearchParams } from "react-router";
import ProductCard from "../components/Home/ProductCard";
import ProductGridSkeleton from "../components/ui/ProductGridSkeleton";
import QueryError from "../components/ui/QueryError";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { slugify } from "../utils/slug";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const query = (searchParams.get("q") ?? "").trim();

  const productsQuery = useProducts();
  const categoriesQuery = useCategories();

  const chips = [
    { label: "All", slug: "all" },
    ...(categoriesQuery.data ?? []).map((c) => ({ label: c.name, slug: slugify(c.name) })),
  ];

  const search = query.toLowerCase();
  const visible = (productsQuery.data ?? []).filter((p) => {
    const matchesCategory = category === "all" || p.categorySlug === category;
    const matchesQuery =
      search === "" ||
      p.name.toLowerCase().includes(search) ||
      p.categoryName.toLowerCase().includes(search);
    return matchesCategory && matchesQuery;
  });

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug === "all") next.delete("category");
    else next.set("category", slug);
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

      {productsQuery.isSuccess && (
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
      )}

      <div className="mb-6 mt-4 flex gap-2 overflow-x-auto">
        {chips.map((chip) => (
          <button
            key={chip.slug}
            type="button"
            onClick={() => selectCategory(chip.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              chip.slug === category
                ? "bg-brand text-white"
                : "bg-brand-soft text-slate-700 hover:text-brand"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {productsQuery.isPending && (
        <>
          <p className="mb-4 text-xs text-slate-500">
            Loading products. The server may take a moment to wake up.
          </p>
          <ProductGridSkeleton />
        </>
      )}

      {productsQuery.isError && (
        <QueryError message={productsQuery.error.message} onRetry={() => productsQuery.refetch()} />
      )}

      {productsQuery.isSuccess &&
        (visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            {query
              ? `Nothing matches "${query}". Check the spelling or try a shorter word.`
              : "No products in this category yet."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ))}
    </section>
  );
}

export default ProductsPage;