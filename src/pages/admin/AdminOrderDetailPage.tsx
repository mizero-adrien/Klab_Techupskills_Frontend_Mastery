import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ProductImage from "../../components/ui/ProductImage";
import QueryError from "../../components/ui/QueryError";
import { useAdminOrder, useUpdateOrderStatus } from "../../hooks/useOrders";
import { money } from "../../utils/money";
import type { OrderStatus } from "../../types/product";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderQuery = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();

  const availableNext = useMemo(() => {
    if (!orderQuery.data) return [];
    return NEXT_STATUS[orderQuery.data.status];
  }, [orderQuery.data]);

  const applyStatus = async (status: OrderStatus) => {
    if (!orderQuery.data) return;

    if (status === "cancelled") {
      const confirmed = window.confirm(
        "Cancel this order? This will restore stock for all items in this order."
      );
      if (!confirmed) return;
    }

    try {
      await updateStatus.mutateAsync({ id: orderQuery.data.id, status });
      toast.success("Order status updated.");
      await orderQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order status");
    }
  };

  if (orderQuery.isPending) {
    return (
      <div className="animate-pulse space-y-4" aria-busy="true">
        <div className="h-10 rounded bg-slate-100" />
        <div className="h-64 rounded bg-slate-100" />
      </div>
    );
  }

  if (orderQuery.isError) {
    return <QueryError message={orderQuery.error.message} onRetry={() => orderQuery.refetch()} />;
  }

  if (!orderQuery.data) return null;

  const order = orderQuery.data;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const created = new Date(order.createdAt).toLocaleString("en-RW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <AdminPageHeader
        title={`Order ${order.id.slice(-8).toUpperCase()}`}
        description={`${created} · ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        actions={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
          >
            Back
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white">
            <h2 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-800">
              Items
            </h2>
            <ul className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 px-5 py-3">
                  <ProductImage
                    src={item.productImage}
                    alt=""
                    iconSize={18}
                    className="h-10 w-10 shrink-0 rounded-md bg-slate-100 p-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{item.productName}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {money(item.priceAtPurchase * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-slate-100 px-5 py-4 text-sm font-semibold text-slate-900">
              <span>Total</span>
              <span>{money(order.totalAmount)}</span>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">Delivery details</h2>
            <div className="mt-3 text-sm text-slate-600">
              <p className="font-medium text-slate-800">{order.delivery.fullName}</p>
              <p>{order.delivery.phone}</p>
              <p>{order.delivery.address}</p>
              <p>{order.delivery.city}</p>
            </div>
          </section>
        </div>

        <aside className="space-y-4 self-start">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">Customer</h2>
            <p className="mt-2 text-sm font-medium text-slate-800">{order.userName}</p>
            <p className="text-sm text-slate-600">{order.userEmail}</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">Payment</h2>
            <p className="mt-2 text-sm text-slate-600">
              {order.paymentMethod === "momo" ? "Mobile Money" : "Cash on delivery"}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-800">Status</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            {availableNext.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {availableNext.map((next) => (
                  <button
                    key={next}
                    type="button"
                    disabled={updateStatus.isPending}
                    onClick={() => applyStatus(next)}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mark as {STATUS_LABELS[next]}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">No further status changes allowed.</p>
            )}
          </section>

          <Link
            to="/admin/orders"
            className="inline-block text-sm font-medium text-brand hover:underline"
          >
            Back to all orders
          </Link>
        </aside>
      </div>
    </>
  );
}

export default AdminOrderDetailPage;
