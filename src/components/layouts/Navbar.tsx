
import { ChevronDown } from "lucide-react";

const categories = [
  "Groceries",
  "Premium Fruits",
  "Home & Kitchen",
  "Fashion",
  "Electronics",
  "Beauty",
  "Home Improvement",
  "Sports, Toys & Luggage",
];

function Navbar() {
  return (
    <nav
      aria-label="Product categories"
      className="border-b border-slate-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              index === 0
                ? "bg-brand text-white"
                : "bg-brand-soft text-slate-700 hover:bg-blue-50 hover:text-brand"
            }`}
          >
            {category}
            <ChevronDown size={14} />
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;