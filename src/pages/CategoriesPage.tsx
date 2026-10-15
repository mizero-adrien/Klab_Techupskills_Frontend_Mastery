import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { navCategories, products } from "../data/Home";

function CategoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">All categories</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a department, or jump straight to a subcategory.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navCategories.map((category) => {
          const count = products.filter((p) => p.category === category.slug).length;

          return (
            <div
              key={category.slug}
              className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">{category.label}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {count} {count === 1 ? "product" : "products"}
                  </p>
                </div>
                <Link
                  to={`/products?category=${category.slug}`}
                  aria-label={`View all ${category.label}`}
                  className="rounded-full bg-brand-soft p-1.5 text-brand hover:bg-blue-50"
                >
                  <ChevronRight size={16} />
                </Link>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {category.children.map((child) => (
                  <li key={child.term}>
                    <Link
                      to={`/products?category=${category.slug}&q=${encodeURIComponent(child.term)}`}
                      className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CategoriesPage;