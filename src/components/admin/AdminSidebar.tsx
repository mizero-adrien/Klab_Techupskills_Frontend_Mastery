import { Link, NavLink, useNavigate } from "react-router";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  Tags,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../config/brand";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; soon?: boolean };

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
];

type Props = { open: boolean; onClose: () => void };

function AdminSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      id="admin-sidebar"
      aria-label="Admin sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-all duration-200 max-lg:shadow-xl ${
        open ? "" : "max-lg:invisible max-lg:-translate-x-full"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link to="/admin" onClick={onClose} className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">{BRAND_NAME}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Admin
          </span>
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav aria-label="Admin sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end, soon }) =>
          soon ? (
            <div
              key={to}
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm text-slate-500"
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                Soon
              </span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand bg-white/10 text-white"
                    : "border-transparent hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          )
        )}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white"
        >
          <Store size={14} />
          Back to shop
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {user?.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={handleLogout}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
