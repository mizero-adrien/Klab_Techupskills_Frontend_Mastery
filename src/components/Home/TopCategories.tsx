import { Link } from "react-router";
import SectionHeading from "./SectionHeading";
import { useCategories } from "../../hooks/useCategories";
import { slugify } from "../../utils/slug";

const MAX_VISIBLE = 7;

function TopCategories() {
  const { data, isPending, isError } = useCategories();

  if (isError || (!isPending && (!data || data.length === 0))) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Shop From" highlight="Top Categories" to="/categories" />

      {isPending ? (
        <div className="flex animate-pulse gap-6 overflow-hidden p-2" aria-busy="true">
          {Array.from({ length: MAX_VISIBLE }, (_, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-full bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto p-2 sm:justify-between">
          {data?.slice(0, MAX_VISIBLE).map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${slugify(category.name)}`}
              className="group flex w-24 shrink-0 flex-col items-center gap-2"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-2xl font-semibold text-brand transition group-hover:ring-2 group-hover:ring-brand group-hover:ring-offset-2">
                {category.name.charAt(0).toUpperCase()}
              </span>
              <span className="line-clamp-2 text-center text-xs text-slate-600 group-hover:text-brand">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default TopCategories;