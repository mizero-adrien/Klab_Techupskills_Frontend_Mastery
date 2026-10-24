import { useState } from "react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useAdminOrder, useUpdateOrderStatus } from "../../hooks/useOrders";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS } from "../../constants/order";
import { ApiError } from "../../services/api";
import type { OrderStatus } from "../../types/order";
import { money } from "../../utils/money";
import OrderStatusBadge from "../../components/ui/OrderStatusBadge";
import ProductImage from "../../components/ui/ProductImage";
import QueryError from "../../components/ui/QueryError";

// Mirrors ALLOWED_TRANSITIONS in order.service.ts. The server enforces it too.
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function AdminOrderDetailPage() {
  const { id } = useParams();
  const { data: order, isPending, isError, error, refetch } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const backLink = (
    <Link
      to="/admin/orders"
      className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
    >
      <ArrowLeft size={14} />
      Back to orders
    </Link>
  );

  if (isPending) {
    return (
      <>
        {backLink}
        <div className="animate-pulse space-y-4" aria-busy="true">
          <div className="h-8 w-1/3 rounded bg-slate-100" />
          <div className="h-64 rounded-xl bg-slate-100" />
        </div>
      </>
    );
  }

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;

    return (
      <>
        {backLink}
        {notFound ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            That order doesn't exist.
          </p>
        ) : (
          <QueryError message={error.message} onRetry={() => refetch()} />
        )}
      </>
    );
  }

  const nextStatuses = NEXT_STATUSES[order.status];

  const changeStatus = async (status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[status].toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the order");
    } finally {
      setConfirmCancel(false);
    }
  };

  return (
    <>
      {backLink}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Order {order.reference}</h1>
        <OrderStatusBadge status={order.status} />
        <p className="text-sm text-slate-500">
          {new Date(order.createdAt).toLocaleString("en-RW", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-slate-200 bg-white">
          <h2 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-800">
            Items ({order.itemCount})
          </h2>
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.productId ?? item.name} className="flex items-center gap-3 px-5 py-3">
                <ProductImage
                  src={item.image}
                  alt=""
                  iconSize={20}
                  className="h-12 w-12 shrink-0 rounded-md bg-slate-100 p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {money(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{money(item.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-slate-100 px-5 py-4 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </section>

        <div className="space-y-6 self-start">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">Update status</h2>

            {nextStatuses.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                This order is {ORDER_STATUS_LABELS[order.status].toLowerCase()}, so its status can no
                longer change.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {nextStatuses.map((status) =>
                  status === "cancelled" ? (
                    confirmCancel ? (
                      <div key={status} className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-600">
                          Cancel and return the stock?
                        </span>
                        <button
                          type="button"
                          disabled={updateStatus.isPending}
                          onClick={() => changeStatus(status)}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Yes, cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancel(false)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        key={status}
                        type="button"
                        disabled={updateStatus.isPending}
                        onClick={() => setConfirmCancel(true)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel order
                      </button>
                    )
                  ) : (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() => changeStatus(status)}
                      className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark as {ORDER_STATUS_LABELS[status].toLowerCase()}
                    </button>
                  )
                )}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <h2 className="font-semibold text-slate-800">Customer</h2>
            <p className="mt-2 text-slate-700">{order.customerName}</p>
            <a href={`mailto:${order.customerEmail}`} className="text-brand hover:underline">
              {order.customerEmail}
            </a>

            <h2 className="mt-5 font-semibold text-slate-800">Delivery</h2>
            <p className="mt-2 text-slate-600">{order.delivery.fullName}</p>
            <p className="text-slate-600">{order.delivery.address}</p>
            <p className="text-slate-600">{order.delivery.city}</p>
            <a href={`tel:${order.delivery.phone}`} className="text-brand hover:underline">
              {order.delivery.phone}
            </a>

            <h2 className="mt-5 font-semibold text-slate-800">Payment</h2>
            <p className="mt-2 text-slate-600">{PAYMENT_LABELS[order.payment]}</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default AdminOrderDetailPage;