import { Link, useLocation, useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";
import { navCategories } from "../../data/Home";

function Navbar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const activeSlug = pathname === "/products" ? searchParams.get("category") : null;

  return (
    <nav
      aria-label="Product categories"
      className="border-b border-slate-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5">
        {navCategories.map(({ label, slug }) => {
          const isActive = slug === activeSlug;

          return (
            <Link
              key={slug}
              to={`/products?category=${slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-brand text-white"
                  : "bg-brand-soft text-slate-700 hover:bg-blue-50 hover:text-brand"
              }`}
            >
              {label}
              <ChevronDown size={14} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;