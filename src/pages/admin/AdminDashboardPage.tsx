import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  ClipboardList,
  Hourglass,
  Package,
  PackageX,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { useAdminOrders } from "../../hooks/useOrders";
import { money } from "../../utils/money";
import type { Product } from "../../lib/toProducts";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OrderStatusBadge from "../../components/ui/OrderStatusBadge";
import ProductImage from "../../components/ui/ProductImage";
import QueryError from "../../components/ui/QueryError";

const LOW_STOCK = 5;

type Tone = "brand" | "amber" | "red" | "green";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  green: "bg-green-50 text-green-600",
};

type StatProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone: Tone;
  to?: string;
};

function StatCard({ label, value, hint, icon: Icon, tone, to }: StatProps) {
  const body = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-semibold text-slate-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </>
  );

  const className = "flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5";

  return to ? (
    <Link to={to} className={`${className} hover:border-brand`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PanelMessage({ children }: { children: ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-500">{children}</p>;
}

function ProductRow({ product }: { product: Product }) {
  return (
    <li>
      <Link
        to={`/admin/products/${product.id}/edit`}
        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50"
      >
        <ProductImage
          src={product.image}
          alt=""
          iconSize={18}
          className="h-10 w-10 shrink-0 rounded-md bg-slate-100 p-0.5"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
          <p className="text-xs text-slate-500">{product.categoryName}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            product.stock === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
          }`}
        >
          {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
        </span>
      </Link>
    </li>
  );
}

function AdminDashboardPage() {
  const productsQuery = useProducts();
  const ordersQuery = useAdminOrders({ limit: 5 });

  const products = productsQuery.data;
  const orders = ordersQuery.data;

  const outOfStock = products?.filter((p) => p.stock === 0).length ?? 0;
  const restock = (products ?? [])
    .filter((p) => p.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A quick look at your shop."
        actions={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={16} />
            Add product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={orders ? String(Object.values(orders.statusCounts).reduce((a, b) => a + b, 0)) : "–"}
          hint="All time"
          icon={ClipboardList}
          tone="brand"
          to="/admin/orders"
        />
        <StatCard
          label="Pending orders"
          value={orders ? String(orders.pendingOrders) : "–"}
          hint="Waiting for payment"
          icon={Hourglass}
          tone="amber"
          to="/admin/orders?status=pending"
        />
        <StatCard
          label="Revenue"
          value={orders ? money(orders.totalRevenue) : "–"}
          hint="Cancelled orders excluded"
          icon={Wallet}
          tone="green"
        />
        <StatCard
          label="Out of stock"
          value={products ? String(outOfStock) : "–"}
          hint={products ? `${products.length} products in total` : undefined}
          icon={PackageX}
          tone="red"
          to="/admin/products"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Latest orders"
          action={
            <Link to="/admin/orders" className="text-xs font-medium text-brand hover:underline">
              View all
            </Link>
          }
        >
          {ordersQuery.isPending && (
            <div className="animate-pulse space-y-3 p-5" aria-busy="true">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-10 rounded bg-slate-100" />
              ))}
            </div>
          )}

          {ordersQuery.isError && !orders && (
            <div className="p-5">
              <QueryError
                message={ordersQuery.error.message}
                onRetry={() => ordersQuery.refetch()}
              />
            </div>
          )}

          {orders && orders.orders.length === 0 && <PanelMessage>No orders yet.</PanelMessage>}

          {orders && orders.orders.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {orders.orders.slice(0, 5).map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">{order.reference}</p>
                      <p className="truncate text-xs text-slate-500">{order.customerName}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <p className="w-full text-right text-sm font-medium text-slate-900 sm:w-28">
                      {money(order.total)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Needs restocking"
          action={
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Package size={14} />
              {LOW_STOCK} or fewer
            </span>
          }
        >
          {productsQuery.isPending && (
            <div className="animate-pulse space-y-3 p-5" aria-busy="true">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-10 rounded bg-slate-100" />
              ))}
            </div>
          )}

          {productsQuery.isError && !products && (
            <div className="p-5">
              <QueryError
                message={productsQuery.error.message}
                onRetry={() => productsQuery.refetch()}
              />
            </div>
          )}

          {products && restock.length === 0 && <PanelMessage>Everything is well stocked.</PanelMessage>}

          {restock.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {restock.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

export default AdminDashboardPage;
