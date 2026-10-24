import { Link, useSearchParams } from "react-router";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OrderStatusBadge from "../../components/ui/OrderStatusBadge";
import QueryError from "../../components/ui/QueryError";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS } from "../../constants/order";
import { useAdminOrders } from "../../hooks/useOrders";
import { ORDER_STATUSES, type OrderStatus } from "../../types/order";
import { money } from "../../utils/money";

const isOrderStatus = (value: string | null): value is OrderStatus =>
  value !== null && (ORDER_STATUSES as readonly string[]).includes(value);

function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get("status");
  const status = isOrderStatus(statusParam) ? statusParam : undefined;
  const q = (searchParams.get("q") ?? "").trim();

  const query = useAdminOrders({ status, q });
  const { data } = query;

  const setStatus = (next: OrderStatus | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("status", next);
    else params.delete("status");
    setSearchParams(params);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    setSearchParams(params);
  };

  // The server counts every status for the current search, so "All" is their sum
  const allCount = data
    ? Object.values(data.statusCounts).reduce((sum, count) => sum + count, 0)
    : undefined;

  const tabs: { value: OrderStatus | undefined; label: string; count?: number }[] = [
    { value: undefined, label: "All", count: allCount },
    ...ORDER_STATUSES.map((value) => ({
      value,
      label: ORDER_STATUS_LABELS[value],
      count: data?.statusCounts[value],
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description={
          data
            ? `${data.total} ${data.total === 1 ? "order" : "orders"}${q ? ` matching "${q}"` : ""}`
            : undefined
        }
        actions={
          q ? (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
            >
              Clear search
            </button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {tabs.map((tab) => {
          const isActive = tab.value === status;

          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setStatus(tab.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" ? ` (${tab.count})` : ""}
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

      {query.isError && !data && (
        <QueryError message={query.error.message} onRetry={() => query.refetch()} />
      )}

      {data && data.orders.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
          {q ? "No orders match your search." : "No orders found for this filter."}
        </p>
      )}

      {data && data.orders.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("en-RW", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.itemCount}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{money(order.total)}</td>
                    <td className="px-4 py-3 text-slate-600">{PAYMENT_LABELS[order.payment]}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500">
              Showing {data.orders.length} of {data.total}
            </p>

            {query.isFetchNextPageError && (
              <p role="alert" className="text-xs text-red-600">
                {query.error?.message ?? "Could not load more orders."}
              </p>
            )}

            {query.hasNextPage && (
              <button
                type="button"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
                className="rounded-md border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
              >
                {query.isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default AdminOrdersPage;