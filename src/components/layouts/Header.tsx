import { Link, useSearchParams } from "react-router";
import { Menu, ShoppingCart, User } from "lucide-react";
import { BRAND_NAME } from "../../config/brand";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";

function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, openLogin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4">
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

        <div className="w-full max-md:order-last md:mx-auto md:max-w-2xl md:flex-1">
          <SearchBar key={urlQuery} initialQuery={urlQuery} />
        </div>

        <nav className="flex items-center gap-5 text-sm font-semibold max-md:ml-auto">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand hover:bg-blue-50"
                >
                  Admin
                </Link>
              )}
              <Link to="/account" className="flex items-center gap-2 hover:text-brand">
                <User size={18} className="text-brand" />
                <span className="hidden sm:inline">Hi, {user.name}</span>
              </Link>
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