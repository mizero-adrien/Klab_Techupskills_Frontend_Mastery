import { Link } from "react-router";
import { Menu, Search, SlidersHorizontal, ShoppingCart, User } from "lucide-react";
import { BRAND_NAME } from "../../config/brand";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { totalItems } = useCart();
  const { user, openLogin, logout } = useAuth();

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg bg-brand-soft p-2 text-brand"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="text-2xl font-bold text-brand">
            {BRAND_NAME}
          </Link>
        </div>

        <div className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-xl bg-brand-soft px-4 py-2.5 md:flex">
          <Search size={18} className="text-brand" />
          <input
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <SlidersHorizontal size={18} className="text-brand" />
        </div>

        <nav className="ml-auto flex items-center gap-5 text-sm font-semibold">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <User size={18} className="text-brand" />
                <span className="hidden sm:inline">Hi, {user.name}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-slate-500 hover:text-brand"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="flex items-center gap-2 hover:text-brand"
            >
              <User size={18} className="text-brand" />
              <span className="hidden sm:inline">Sign Up/Sign In</span>
            </button>
          )}

          <span className="h-6 w-px bg-slate-200" />

          <Link to="/cart" className="flex items-center gap-2 hover:text-brand">
            <span className="relative">
              <ShoppingCart size={18} className="text-brand" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;