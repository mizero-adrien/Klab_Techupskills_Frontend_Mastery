import { Link } from "react-router";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type UserMenuProps = {
  variant?: "header" | "card";
  className?: string;
};

function UserMenu({ variant = "header", className = "" }: UserMenuProps) {
  const { user, isAdmin, logout } = useAuth();

  if (!user) return null;

  const isCard = variant === "card";

  return (
    <div className={`group relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-label="Open account menu"
        className={
          isCard
            ? "flex w-full items-center gap-3 rounded-lg p-1 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            : "flex items-center gap-2 rounded-full px-1 py-1 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        }
      >
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white ${
            isCard ? "h-14 w-14 text-xl" : "h-8 w-8 text-sm"
          }`}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>

        <span
          className={
            isCard ? "min-w-0 flex-1" : "hidden max-w-[10rem] truncate text-sm font-semibold sm:inline"
          }
        >
          <span
            className={`block truncate font-semibold text-slate-800 ${
              isCard ? "text-base" : "text-sm"
            }`}
          >
            {isCard ? user.name : `Hi, ${user.name}`}
          </span>
          {isCard && <span className="block truncate text-xs text-slate-500">{user.email}</span>}
        </span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="shrink-0 text-slate-400 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </button>

      <div
        className={`invisible absolute top-full z-50 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
          isCard ? "left-0 right-0" : "right-0"
        }`}
      >
        <div
          role="menu"
          className="rounded-xl border border-slate-100 bg-white p-1.5 text-sm shadow-lg"
        >
          {!isCard && (
            <div className="px-3 py-2">
              <p className="truncate font-semibold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          )}

          {!isCard && (
            <Link
              to="/account"
              role="menuitem"
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-brand-soft hover:text-brand"
            >
              <UserRound size={16} aria-hidden="true" />
              My account
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              role="menuitem"
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-brand-soft hover:text-brand"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Admin dashboard
            </Link>
          )}

          <div className="my-1 h-px bg-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
