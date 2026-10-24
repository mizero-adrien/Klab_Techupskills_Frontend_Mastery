import { Link, useParams } from "react-router";
import { CircleCheck } from "lucide-react";
import { useOrder } from "../hooks/useOrders";
import { PAYMENT_LABELS } from "../constants/order";
import { ApiError } from "../services/api";
import { money } from "../utils/money";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import ProductImage from "../components/ui/ProductImage";
import QueryError from "../components/ui/QueryError";

function OrderSuccessPage() {
  const { id } = useParams();
  const { data: order, isPending, isError, error, refetch } = useOrder(id);

  if (isPending) {
    return (
      <section className="mx-auto max-w-2xl animate-pulse px-4 py-12" aria-busy="true">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100" />
        <div className="mx-auto mt-4 h-6 w-2/3 rounded bg-slate-100" />
        <div className="mt-8 h-48 rounded-lg bg-slate-100" />
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
              We can't find that order on your account.
            </p>
            <Link
              to="/account"
              className="mt-6 inline-block rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white"
            >
              View my orders
            </Link>
          </>
        ) : (
          <QueryError message={error.message} onRetry={() => refetch()} />
        )}
      </section>
    );
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
        <h1 className="mt-4 text-2xl font-semibold text-slate-800">
          Thank you, your order is placed
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Order <span className="font-semibold text-slate-800">{order.reference}</span> · {date}
        </p>
        <div className="mt-3">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-800">Items</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.productId ?? item.name} className="flex items-center gap-3 py-3">
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
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{money(order.total)}</span>
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
          <p className="mt-1 text-slate-600">{PAYMENT_LABELS[order.payment]}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/account"
          className="rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          View my orders
        </Link>
        <Link
          to="/products"
          className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;