import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { slugify } from "../../utils/slug";

const VISIBLE_COUNT = 6;
const PANEL_WIDTH = 256; // matches w-64 below
const MAX_CHILDREN = 6;

type OpenMenu = { slug: string; left: number };

function Navbar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const activeSlug = pathname === "/products" ? searchParams.get("category") : null;

  const [menu, setMenu] = useState<OpenMenu | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const isOpen = menu !== null;

  const { data: categories, isPending: categoriesPending } = useCategories();
  const { data: products } = useProducts();

  // The API stores categories flat, so the dropdown items are the products
  // inside each category. They link to a search inside that category.
  const navCategories = useMemo(
    () =>
      (categories ?? []).map((category) => ({
        label: category.name,
        slug: slugify(category.name),
        children: (products ?? [])
          .filter((product) => product.categorySlug === slugify(category.name))
          .slice(0, MAX_CHILDREN)
          .map((product) => ({ label: product.name, term: product.name })),
      })),
    [categories, products]
  );

  const openCategory = menu
    ? navCategories.find((c) => c.slug === menu.slug)
    : undefined;

  const visibleCategories = navCategories.slice(0, VISIBLE_COUNT);
  const hasMore = navCategories.length > VISIBLE_COUNT;
  const isMoreActive = pathname === "/categories";

  const toggleMenu = (slug: string, e: MouseEvent<HTMLButtonElement>) => {
    if (menu?.slug === slug) {
      setMenu(null);
      return;
    }
    if (!navRef.current) return;

    const navBox = navRef.current.getBoundingClientRect();
    const btnBox = e.currentTarget.getBoundingClientRect();
    const maxLeft = navBox.width - PANEL_WIDTH - 8;
    const left = Math.max(8, Math.min(btnBox.left - navBox.left, maxLeft));

    setMenu({ slug, left });
  };

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setMenu(null);
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      aria-label="Product categories"
      className="relative border-b border-slate-100 bg-white"
    >
      <div
        onScroll={() => setMenu(null)}
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5"
      >
        {categoriesPending && (
          <div className="flex gap-2" aria-busy="true">
            {Array.from({ length: VISIBLE_COUNT }, (_, i) => (
              <div key={i} className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-slate-100" />
            ))}
          </div>
        )}

        {visibleCategories.map(({ label, slug }) => {
          const isActive = slug === activeSlug;
          const isThisOpen = slug === menu?.slug;

          return (
            <button
              key={slug}
              type="button"
              aria-expanded={isThisOpen}
              aria-controls={`menu-${slug}`}
              onClick={(e) => toggleMenu(slug, e)}
              className={`flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:flex-1 ${
                isActive
                  ? "bg-brand text-white"
                  : isThisOpen
                    ? "bg-blue-50 text-brand"
                    : "bg-brand-soft text-slate-700 hover:bg-blue-50 hover:text-brand"
              }`}
            >
              {label}
              <ChevronDown
                size={14}
                className={`transition-transform ${isThisOpen ? "rotate-180" : ""}`}
              />
            </button>
          );
        })}

        {hasMore && (
          <Link
            to="/categories"
            onClick={() => setMenu(null)}
            aria-current={isMoreActive ? "page" : undefined}
            className={`flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:flex-1 ${
              isMoreActive
                ? "border-brand bg-brand text-white"
                : "border-brand/30 text-brand hover:bg-blue-50"
            }`}
          >
            More
            <LayoutGrid size={14} />
          </Link>
        )}
      </div>

      {menu && openCategory && (
        <div
          id={`menu-${openCategory.slug}`}
          style={{ left: menu.left }}
          className="absolute top-full z-40 mt-1 max-h-[60vh] w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-md"
        >
          <Link
            to={`/products?category=${openCategory.slug}`}
            onClick={() => setMenu(null)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            All {openCategory.label}
          </Link>

          {openCategory.children.length > 0 && (
            <ul className="mt-1 border-t border-slate-100 pt-1">
              {openCategory.children.map((child) => (
                <li key={child.term}>
                  <Link
                    to={`/products?category=${openCategory.slug}&q=${encodeURIComponent(child.term)}`}
                    onClick={() => setMenu(null)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
