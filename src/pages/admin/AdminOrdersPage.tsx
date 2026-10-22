import { Link, useSearchParams } from "react-router";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import QueryError from "../../components/ui/QueryError";
import { useAdminOrders } from "../../hooks/useOrders";
import { money } from "../../utils/money";
import type { OrderStatus } from "../../types/product";

const STATUS_OPTIONS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

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

const parsePage = (raw: string | null) => {
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const q = (searchParams.get("q") ?? "").trim();
  const page = parsePage(searchParams.get("page"));
  const status =
    statusParam === "pending" ||
    statusParam === "paid" ||
    statusParam === "shipped" ||
    statusParam === "delivered" ||
    statusParam === "cancelled"
      ? statusParam
      : undefined;

  const query = useAdminOrders({ status, page, limit: 20, q });

  const setFilter = (nextStatus: "all" | OrderStatus) => {
    const next = new URLSearchParams(searchParams);
    if (nextStatus === "all") next.delete("status");
    else next.set("status", nextStatus);
    next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const data = query.data;
  const activeStatus = status ?? "all";
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description={
          data
            ? `${data.total} ${data.total === 1 ? "order" : "orders"}${q ? ` matching "${q}"` : ""}`
            : undefined
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => {
          const isActive = activeStatus === option.value;
          const count =
            option.value === "all"
              ? data?.total
              : data?.statusCounts[option.value as OrderStatus];

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {option.label}
              {typeof count === "number" ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {query.isPending && (
        <div className="animate-pulse space-y-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-14 rounded-lg bg-slate-100" />
          ))}
        </div>
      )}

      {query.isError && <QueryError message={query.error.message} onRetry={() => query.refetch()} />}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
          {q ? "No orders match your search." : "No orders found for this filter."}
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const date = new Date(order.createdAt).toLocaleDateString("en-RW", {
                    dateStyle: "medium",
                  });

                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          {order.id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{order.userName}</p>
                        <p className="text-xs text-slate-500">{order.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{date}</td>
                      <td className="px-4 py-3 text-slate-600">{itemCount}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{money(order.totalAmount)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {order.paymentMethod === "momo" ? "Mobile Money" : "Cash"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              Page {data.page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => goToPage(data.page - 1)}
                className="rounded-md border border-slate-200 px-3 py-1.5 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => goToPage(data.page + 1)}
                className="rounded-md border border-slate-200 px-3 py-1.5 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AdminOrdersPage;
