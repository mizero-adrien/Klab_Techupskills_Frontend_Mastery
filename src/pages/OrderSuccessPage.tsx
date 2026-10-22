import { Link, useParams } from "react-router";
import { CircleCheck } from "lucide-react";
import { useOrder } from "../hooks/useOrders";
import { ApiError } from "../services/api";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductImage";
import QueryError from "../components/ui/QueryError";

function OrderSuccessPage() {
  const { id } = useParams();
  const { data: order, isPending, isError, error, refetch } = useOrder(id);

  if (isPending) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100" />
          <div className="mx-auto h-6 w-56 rounded bg-slate-100" />
          <div className="mx-auto h-4 w-64 rounded bg-slate-100" />
          <div className="h-48 rounded-lg bg-slate-100" />
        </div>
      </section>
    );
  }

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;

    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        {notFound ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-800">Order not found</h1>
            <p className="mt-2 text-sm text-slate-500">
              We could not find this order in your account.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white"
            >
              Continue shopping
            </Link>
          </>
        ) : (
          <QueryError message={error.message} onRetry={() => refetch()} />
        )}
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const date = new Date(order.createdAt).toLocaleString("en-RW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CircleCheck size={34} strokeWidth={1.5} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-slate-800">Thank you, your order is placed</h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-semibold text-slate-800">{order.id}</span> · {date}
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-800">Items</h2>
        <ul className="mt-3 divide-y divide-slate-100">
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
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{money(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 rounded-lg border border-slate-100 p-5 text-sm sm:grid-cols-2">
        <div>
          <h2 className="font-semibold text-slate-800">Delivering to</h2>
          <p className="mt-1 text-slate-600">{order.delivery.fullName}</p>
          <p className="text-slate-600">{order.delivery.address}</p>
          <p className="text-slate-600">{order.delivery.city}</p>
          <p className="text-slate-600">{order.delivery.phone}</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Payment</h2>
          <p className="mt-1 text-slate-600">
            {order.paymentMethod === "momo" ? "Mobile Money" : "Cash on delivery"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/products"
          className="rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Continue shopping
        </Link>
        <Link
          to="/"
          className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;