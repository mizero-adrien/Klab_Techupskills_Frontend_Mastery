import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  User,
  UserRound,
  X,
} from "lucide-react";
import { BRAND_NAME } from "../../config/brand";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const mobileItem =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-soft hover:text-brand";

function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, openLogin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const urlQuery = searchParams.get("q") ?? "";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg bg-brand-soft p-2 text-brand md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-brand">
            {BRAND_NAME}
          </Link>
        </div>

        <div className="w-full max-md:order-last md:mx-auto md:max-w-2xl md:flex-1">
          <SearchBar key={urlQuery} initialQuery={urlQuery} />
        </div>

        <nav className="flex items-center gap-5 text-sm font-semibold max-md:ml-auto">
          {user ? (
            <UserMenu />
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

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-slate-100 md:hidden">
          <nav aria-label="Mobile" className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
            <Link to="/" onClick={closeMenu} className={mobileItem}>
              <Home size={18} className="text-brand" aria-hidden="true" />
              Home
            </Link>
            <Link to="/products" onClick={closeMenu} className={mobileItem}>
              <ShoppingBag size={18} className="text-brand" aria-hidden="true" />
              All products
            </Link>
            <Link to="/categories" onClick={closeMenu} className={mobileItem}>
              <LayoutGrid size={18} className="text-brand" aria-hidden="true" />
              Categories
            </Link>
            <Link to="/cart" onClick={closeMenu} className={mobileItem}>
              <ShoppingCart size={18} className="text-brand" aria-hidden="true" />
              Cart{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>

            {user ? (
              <>
                <Link to="/account" onClick={closeMenu} className={mobileItem}>
                  <UserRound size={18} className="text-brand" aria-hidden="true" />
                  My account
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className={mobileItem}>
                    <LayoutDashboard size={18} className="text-brand" aria-hidden="true" />
                    Admin dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openLogin();
                }}
                className={mobileItem}
              >
                <LogIn size={18} className="text-brand" aria-hidden="true" />
                Sign up / Sign in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
