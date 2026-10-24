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
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="self-start lg:sticky lg:top-4">
          <nav aria-label="Filter products by category">
            <h2 className="text-sm font-semibold text-slate-800">Categories</h2>

            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
              {categoriesQuery.isPending &&
                Array.from({ length: 4 }, (_, i) => (
                  <li
                    key={i}
                    className="h-9 w-28 shrink-0 animate-pulse rounded-md bg-slate-100 lg:w-full"
                  />
                ))}

              {!categoriesQuery.isPending &&
                chips.map((chip) => {
                  const isActive = chip.slug === category;

                  return (
                    <li key={chip.slug}>
                      <button
                        type="button"
                        onClick={() => selectCategory(chip.slug)}
                        aria-pressed={isActive}
                        className={`w-auto shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
                          isActive
                            ? "bg-brand text-white"
                            : "text-slate-600 hover:bg-brand-soft hover:text-brand"
                        }`}
                      >
                        {chip.label}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
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

          <div className="mt-6">
            {productsQuery.isPending && (
              <>
                <p className="mb-4 text-xs text-slate-500">
                  Loading products. The server may take a moment to wake up.
                </p>
                <ProductGridSkeleton />
              </>
            )}

            {productsQuery.isError && (
              <QueryError
                message={productsQuery.error.message}
                onRetry={() => productsQuery.refetch()}
              />
            )}

            {productsQuery.isSuccess &&
              (visible.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  {query
                    ? `Nothing matches "${query}". Check the spelling or try a shorter word.`
                    : "No products in this category yet."}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsPage;
