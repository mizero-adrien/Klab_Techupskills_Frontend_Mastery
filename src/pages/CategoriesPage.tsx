import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { slugify } from "../utils/slug";
import QueryError from "../components/ui/QueryError";

const MAX_CHILDREN = 6;

function CategoriesPage() {
  const { data: categories, isPending, isError, error, refetch } = useCategories();
  const { data: products } = useProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">All categories</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a department, or jump straight to a product.
      </p>

      {isPending && (
        <div className="mt-6 grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <QueryError message={error.message} onRetry={() => refetch()} />
        </div>
      )}

      {isError === false && categories && categories.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">
          No categories yet. New departments are coming soon.
        </p>
      )}

      {categories && categories.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const slug = slugify(category.name);
            const productsInCategory = (products ?? []).filter(
              (p) => p.categorySlug === slug
            );
            const count = category.productCount ?? productsInCategory.length;

            return (
              <div
                key={category._id}
                className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">{category.name}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <Link
                    to={`/products?category=${slug}`}
                    aria-label={`View all ${category.name}`}
                    className="rounded-full bg-brand-soft p-1.5 text-brand hover:bg-blue-50"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {productsInCategory.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {productsInCategory.slice(0, MAX_CHILDREN).map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products?category=${slug}&q=${encodeURIComponent(product.name)}`}
                          className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;
