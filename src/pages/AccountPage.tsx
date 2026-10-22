import { Link, useNavigate } from "react-router";
import { ChevronDown, PackageOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useMyOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductImage";
import QueryError from "../components/ui/QueryError";
import type { Order } from "../lib/toOrders";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-RW", { dateStyle: "medium" });

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrderCard({ order }: { order: Order }) {
  const { addToCart } = useCart();
  const { data: products } = useProducts();
  const navigate = useNavigate();
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const buyAgain = () => {
    if (!products) {
      toast.error("Please wait for products to load and try again.");
      return;
    }

    const byId = new Map(products.map((p) => [p.id, p]));
    const skipped: string[] = [];
    let addedCount = 0;

    for (const item of order.items) {
      const current = byId.get(item.productId);
      if (!current) {
        skipped.push(`${item.productName} (no longer available)`);
        continue;
      }
      if (current.stock <= 0) {
        skipped.push(`${current.name} (out of stock)`);
        continue;
      }

      const qty = Math.min(item.quantity, current.stock);
      if (qty <= 0) {
        skipped.push(`${current.name} (out of stock)`);
        continue;
      }

      addToCart(current, qty);
      addedCount += qty;

      if (qty < item.quantity) {
        skipped.push(`${current.name} (only ${qty} added)`);
      }
    }

    if (addedCount > 0) {
      toast.success("Items added to your cart.");
    }
    if (skipped.length > 0) {
      toast.error(`Some items were skipped: ${skipped.slice(0, 2).join(", ")}${skipped.length > 2 ? "..." : ""}`);
    }
    if (addedCount === 0 && skipped.length === 0) {
      toast.error("No items could be added.");
      return;
    }

    navigate("/cart");
  };

  return (
    <details className="group rounded-lg border border-slate-100 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">{order.id}</p>
          <p className="text-xs text-slate-500">
            {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
        <p className="text-sm font-semibold text-slate-900">{money(order.totalAmount)}</p>
        <ChevronDown
          size={18}
          className="text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-slate-100 p-4">
        <ul className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 py-3">
              <ProductImage
                src={item.productImage}
                alt=""
                iconSize={20}
                className="h-12 w-12 shrink-0 rounded-md bg-slate-100 p-1"
              />
              <p className="flex-1 text-sm text-slate-800">
                {item.productName} <span className="text-slate-500">× {item.quantity}</span>
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {money(item.priceAtPurchase * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-800">Delivered to</p>
            <p>{order.delivery.fullName}</p>
            <p>{order.delivery.address}, {order.delivery.city}</p>
            <p>{order.delivery.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Payment</p>
            <p>{order.paymentMethod === "momo" ? "Mobile Money" : "Cash on delivery"}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={buyAgain}
            className="rounded-md bg-brand px-4 py-2 text-xs font-medium text-white hover:opacity-90"
          >
            Buy again
          </button>
          <Link
            to={`/order-success/${order.id}`}
            className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:border-brand hover:text-brand"
          >
            View confirmation
          </Link>
        </div>
      </div>
    </details>
  );
}

function AccountPage() {
  const { user, openLogin, logout } = useAuth();
  const ordersQuery = useMyOrders();
  const navigate = useNavigate();

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sign in to see your account</h1>
        <p className="mt-2 text-sm text-slate-500">Your profile and orders are tied to your account.</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Sign in
        </button>
      </section>
    );
  }

  if (ordersQuery.isPending) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8" aria-busy="true">
        <h1 className="mb-6 text-2xl font-semibold text-slate-800">My account</h1>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-52 animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (ordersQuery.isError) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-slate-800">My account</h1>
        <QueryError message={ordersQuery.error.message} onRetry={() => ordersQuery.refetch()} />
      </section>
    );
  }

  const myOrders = ordersQuery.data;
  const totalSpent = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">My account</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="self-start rounded-lg border border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-brand-soft p-3">
              <dd className="text-lg font-semibold text-slate-800">{myOrders.length}</dd>
              <dt className="text-xs text-slate-500">Orders</dt>
            </div>
            <div className="rounded-lg bg-brand-soft p-3">
              <dd className="text-sm font-semibold text-slate-800">{money(totalSpent)}</dd>
              <dt className="text-xs text-slate-500">Total spent</dt>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-600"
          >
            Sign out
          </button>
        </aside>

        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-800">Order history</h2>

          {myOrders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 px-6 py-12 text-center">
              <PackageOpen size={36} strokeWidth={1.25} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-800">No orders yet</p>
              <p className="mt-1 text-xs text-slate-500">When you place an order, it shows up here.</p>
              <Link
                to="/products"
                className="mt-5 inline-block rounded-md bg-brand px-5 py-2 text-sm font-medium text-white"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AccountPage;