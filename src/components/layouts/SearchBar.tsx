import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Search, SlidersHorizontal } from "lucide-react";

function SearchBar({ initialQuery }: { initialQuery: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-xl bg-brand-soft px-4 py-2.5"
    >
      <button type="submit" aria-label="Search">
        <Search size={18} className="text-brand" />
      </button>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search essentials, groceries and more..."
        aria-label="Search products"
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
      <SlidersHorizontal size={18} className="text-brand" />
    </form>
  );
}

export default SearchBar;