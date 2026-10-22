import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";

const PRODUCTS_PATH = "/admin/products";
const CATEGORIES_PATH = "/admin/categories";
const ORDERS_PATH = "/admin/orders";

function SearchForm({
  initialQuery,
  targetPath,
  placeholder,
}: {
  initialQuery: string;
  targetPath: string;
  placeholder: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to jump to the search box
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;
      if (typing) return;
      e.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `${targetPath}?q=${encodeURIComponent(term)}` : targetPath);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm outline-none focus:border-brand focus:bg-white"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-400 sm:inline">
        /
      </kbd>
    </form>
  );
}

function AdminSearch() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  let targetPath = PRODUCTS_PATH;
  let placeholder = "Search products...";

  if (pathname.startsWith(CATEGORIES_PATH)) {
    targetPath = CATEGORIES_PATH;
    placeholder = "Search categories...";
  } else if (pathname.startsWith(ORDERS_PATH)) {
    targetPath = ORDERS_PATH;
    placeholder = "Search orders by ID, name or email...";
  }

  const urlQuery = pathname.startsWith(targetPath) ? (searchParams.get("q") ?? "") : "";

  return <SearchForm key={urlQuery} initialQuery={urlQuery} targetPath={targetPath} placeholder={placeholder} />;
}

export default AdminSearch;
