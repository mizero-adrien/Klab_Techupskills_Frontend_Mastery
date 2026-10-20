import { Link, useNavigate } from "react-router";
import { ChevronDown, PackageOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders, type Order } from "../context/OrdersContext";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductsImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-RW", { dateStyle: "medium" });

function OrderCard({ order }: { order: Order }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const buyAgain = () => {
    order.items.forEach(({ product, quantity }) => addToCart(product, quantity));
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
        <p className="text-sm font-semibold text-slate-900">{money(order.total)}</p>
        <ChevronDown
          size={18}
          className="text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-slate-100 p-4">
        <ul className="divide-y divide-slate-100">
          {order.items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-3 py-3">
              <ProductImage
                src={product.image}
                alt=""
                iconSize={20}
                className="h-12 w-12 shrink-0 rounded-md bg-slate-100 p-1"
              />
              <p className="flex-1 text-sm text-slate-800">
                {product.name} <span className="text-slate-500">× {quantity}</span>
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {money(product.price * quantity)}
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
            <p>{order.payment === "momo" ? "Mobile Money" : "Cash on delivery"}</p>
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
  const { orders } = useOrders();
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

  const myOrders = orders.filter(
    (o) => (o.userEmail ?? "").toLowerCase() === user.email.toLowerCase()
  );
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);

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