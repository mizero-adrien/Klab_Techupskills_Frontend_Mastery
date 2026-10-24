import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ChevronDown, PackageOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCancelOrder, useMyOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
import { CUSTOMER_CANCELLABLE, PAYMENT_LABELS } from "../constants/order";
import type { Order } from "../lib/toOrders";
import type { Product } from "../lib/toProducts";
import { money } from "../utils/money";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import ProductImage from "../components/ui/ProductImage";
import QueryError from "../components/ui/QueryError";
import UserMenu from "../components/layouts/UserMenu";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-RW", { dateStyle: "medium" });

type OrderCardProps = { order: Order; products: Product[] | undefined };

function OrderCard({ order, products }: OrderCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cancelOrder = useCancelOrder();
  const [confirming, setConfirming] = useState(false);

  const canCancel = CUSTOMER_CANCELLABLE.includes(order.status);

  // Rebuy with TODAY's product data, not the old snapshot: prices and stock may have changed
  const buyAgain = () => {
    if (!products) return;

    const byId = new Map(products.map((p) => [p.id, p]));
    const unavailable: string[] = [];
    const limited: string[] = [];
    let added = 0;

    order.items.forEach((item) => {
      const product = item.productId ? byId.get(item.productId) : undefined;

      if (!product || product.stock <= 0) {
        unavailable.push(item.name);
        return;
      }

      const quantity = Math.min(item.quantity, product.stock);
      if (quantity < item.quantity) limited.push(product.name);

      addToCart(product, quantity);
      added += 1;
    });

    if (added === 0) {
      toast.error("None of these items are available right now.");
      return;
    }

    const notes: string[] = [];
    if (unavailable.length > 0) notes.push(`Unavailable: ${unavailable.join(", ")}`);
    if (limited.length > 0) notes.push(`Limited stock: ${limited.join(", ")}`);

    toast.success(notes.length > 0 ? `Added to your cart. ${notes.join(". ")}.` : "Added to your cart", {
      duration: notes.length > 0 ? 6000 : 3000,
    });
    navigate("/cart");
  };

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel the order");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <details className="group rounded-lg border border-slate-100 bg-white">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 p-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">Order {order.reference}</p>
          <p className="text-xs text-slate-500">
            {formatDate(order.createdAt)} · {order.itemCount}{" "}
            {order.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
        <p className="text-sm font-semibold text-slate-900">{money(order.total)}</p>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-slate-100 p-4">
        <ul className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={`${item.productId ?? item.name}`} className="flex items-center gap-3 py-3">
              <ProductImage
                src={item.image}
                alt=""
                iconSize={20}
                className="h-12 w-12 shrink-0 rounded-md bg-slate-100 p-1"
              />
              <p className="flex-1 text-sm text-slate-800">
                {item.name} <span className="text-slate-500">× {item.quantity}</span>
              </p>
              <p className="text-sm font-semibold text-slate-900">{money(item.lineTotal)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-800">Delivered to</p>
            <p>{order.delivery.fullName}</p>
            <p>
              {order.delivery.address}, {order.delivery.city}
            </p>
            <p>{order.delivery.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Payment</p>
            <p>{PAYMENT_LABELS[order.payment]}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!products}
            onClick={buyAgain}
            className="rounded-md bg-brand px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Buy again
          </button>

          <Link
            to={`/order-success/${order.id}`}
            className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:border-brand hover:text-brand"
          >
            View confirmation
          </Link>

          {canCancel &&
            (confirming ? (
              <>
                <span className="text-xs text-slate-600">Cancel this order?</span>
                <button
                  type="button"
                  disabled={cancelOrder.isPending}
                  onClick={handleCancel}
                  className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelOrder.isPending ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button
                  type="button"
                  disabled={cancelOrder.isPending}
                  onClick={() => setConfirming(false)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand"
                >
                  Keep it
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-md px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Cancel order
              </button>
            ))}
        </div>

        {!canCancel && order.status !== "cancelled" && order.status !== "delivered" && (
          <p className="mt-3 text-xs text-slate-500">
            This order is already being processed. To change it, please contact support.
          </p>
        )}
      </div>
    </details>
  );
}

function AccountContent() {
  const ordersQuery = useMyOrders();
  const productsQuery = useProducts();

  const orders = ordersQuery.data ?? [];
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">My account</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="self-start rounded-lg border border-slate-100 p-5">
          <UserMenu variant="card" />

          <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-brand-soft p-3">
              <dd className="text-lg font-semibold text-slate-800">
                {ordersQuery.isSuccess ? orders.length : "–"}
              </dd>
              <dt className="text-xs text-slate-500">Orders</dt>
            </div>
            <div className="rounded-lg bg-brand-soft p-3">
              <dd className="text-sm font-semibold text-slate-800">
                {ordersQuery.isSuccess ? money(totalSpent) : "–"}
              </dd>
              <dt className="text-xs text-slate-500">Total spent</dt>
            </div>
          </dl>
        </aside>

        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-800">Order history</h2>

          {ordersQuery.isPending && (
            <div className="animate-pulse space-y-3" aria-busy="true">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-16 rounded-lg bg-slate-100" />
              ))}
            </div>
          )}

          {ordersQuery.isError && (
            <QueryError
              message={ordersQuery.error.message}
              onRetry={() => ordersQuery.refetch()}
            />
          )}

          {ordersQuery.isSuccess && orders.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 px-6 py-12 text-center">
              <PackageOpen size={36} strokeWidth={1.25} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-800">No orders yet</p>
              <p className="mt-1 text-xs text-slate-500">
                When you place an order, it shows up here.
              </p>
              <Link
                to="/products"
                className="mt-5 inline-block rounded-md bg-brand px-5 py-2 text-sm font-medium text-white"
              >
                Browse products
              </Link>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} products={productsQuery.data} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AccountPage() {
  const { user, openLogin } = useAuth();

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sign in to see your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your profile and orders are tied to your account.
        </p>
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

  return <AccountContent />;
}

export default AccountPage;