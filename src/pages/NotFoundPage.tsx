import { Link, useLocation } from "react-router";
import { SearchX } from "lucide-react";

function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        <SearchX size={36} strokeWidth={1.5} />
      </span>

      <h1 className="mt-6 text-2xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        We couldn't find <span className="font-medium text-slate-700">{pathname}</span>. It may
        have moved, or the address has a typo.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Go to home
        </Link>
        <Link
          to="/products"
          className="rounded-md border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
        >
          Browse products
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;