import type { ReactNode } from "react";
import { Link, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../config/brand";
import LoginModal from "./LoginModal";

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xl font-bold text-brand">{BRAND_NAME}</p>
        {children}
      </div>
    </div>
  );
}

function RequireAdmin() {
  const { user, isAdmin, openLogin } = useAuth();

  if (!user) {
    return (
      <>
        <Screen>
          <h1 className="mt-4 text-lg font-semibold text-slate-800">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in with an admin account to continue.</p>
          <button
            type="button"
            onClick={openLogin}
            className="mt-6 w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Sign in
          </button>
          <Link to="/" className="mt-3 block text-xs font-medium text-slate-500 hover:text-brand">
            Back to shop
          </Link>
        </Screen>
        <LoginModal />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <Screen>
        <h1 className="mt-4 text-lg font-semibold text-slate-800">Admins only</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your account doesn't have access to this area.
        </p>
        <Link
          to="/"
          className="mt-6 block rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Back to shop
        </Link>
      </Screen>
    );
  }

  return <Outlet />;
}

export default RequireAdmin;