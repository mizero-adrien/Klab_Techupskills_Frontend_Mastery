import type { ReactNode } from "react";
import { Link } from "react-router";
import { Package, PackageX, Plus, TriangleAlert, Wallet, type LucideIcon } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useAdminOrders } from "../../hooks/useOrders";
import { money } from "../../utils/money";
import type { Product } from "../../lib/toProducts";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
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

type StatProps = { label: string; value: string; hint?: string; icon: LucideIcon; tone: Tone };

function StatCard({ label, value, hint, icon: Icon, tone }: StatProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-semibold text-slate-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <h2 className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ProductRow({ product, right }: { product: Product; right: ReactNode }) {
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
        {right}
      </Link>
    </li>
  );
}

function AdminDashboardPage() {
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const ordersQuery = useAdminOrders({ page: 1, limit: 5 });

  const header = (
    <AdminPageHeader
      title="Dashboard"
      description="A quick look at your catalog."
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
  );

  if (productsQuery.isError) {
    return (
      <>
        {header}
        <QueryError message={productsQuery.error.message} onRetry={() => productsQuery.refetch()} />
      </>
    );
  }

  if (productsQuery.isPending) {
    return (
      <>
        {header}
        <div className="animate-pulse space-y-6" aria-busy="true">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-xl bg-slate-100" />
            <div className="h-72 rounded-xl bg-slate-100" />
          </div>
        </div>
      </>
    );
  }

  const products = productsQuery.data;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const orders = ordersQuery.data;
  const totalOrders = orders?.total ?? 0;
  const pendingOrders = orders?.pendingOrders ?? 0;
  const revenue = orders?.totalRevenue ?? 0;

  const restock = products
    .filter((p) => p.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const recent = [...products]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5);

  return (
    <>
      {header}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total products"
          value={String(products.length)}
          hint={
            categoriesQuery.data
              ? `in ${categoriesQuery.data.length} ${categoriesQuery.data.length === 1 ? "category" : "categories"}`
              : undefined
          }
          icon={Package}
          tone="brand"
        />
        <StatCard label="Low stock" value={String(lowStock)} hint={`${LOW_STOCK} or fewer left`} icon={TriangleAlert} tone="amber" />
        <StatCard label="Out of stock" value={String(outOfStock)} hint="Not available to buy" icon={PackageX} tone="red" />
        <StatCard label="Inventory value" value={money(inventoryValue)} hint="Price × stock" icon={Wallet} tone="green" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={String(totalOrders)} icon={Package} tone="brand" />
        <StatCard label="Pending orders" value={String(pendingOrders)} icon={TriangleAlert} tone="amber" />
        <StatCard label="Revenue" value={money(revenue)} hint="Excludes cancelled" icon={Wallet} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Needs restocking">
          {restock.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Everything is well stocked.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {restock.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  right={
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.stock === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  }
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recently added">
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">No products yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  right={<span className="text-sm font-medium text-slate-800">{money(p.price)}</span>}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Latest orders">
          {ordersQuery.isPending ? (
            <div className="space-y-3 px-5 py-4" aria-busy="true">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : ordersQuery.isError ? (
            <div className="p-4">
              <QueryError message={ordersQuery.error.message} onRetry={() => ordersQuery.refetch()} />
            </div>
          ) : !orders || orders.items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.items.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{order.userName}</p>
                      <p className="truncate text-xs text-slate-500">{order.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{money(order.totalAmount)}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-RW")}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

export default AdminDashboardPage;
