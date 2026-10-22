import { Link } from "react-router";
import { ExternalLink, Menu } from "lucide-react";
import AdminSearch from "./AdminSearch";

type Props = { sidebarOpen: boolean; onMenuClick: () => void };

function AdminTopbar({ sidebarOpen, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <AdminSearch />

      <Link
        to="/"
        className="ml-auto hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand sm:flex"
      >
        View shop
        <ExternalLink size={14} />
      </Link>
    </header>
  );
}

export default AdminTopbar;
