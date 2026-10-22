import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useProducts } from "../../hooks/useProducts";
import { useDeleteProduct } from "../../hooks/useProductMutations";
import { money } from "../../utils/money";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ProductImage from "../../components/ui/ProductImage";
import QueryError from "../../components/ui/QueryError";

function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const { data, isPending, isError, error, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const search = query.toLowerCase();
  const visible = (data ?? []).filter(
    (p) =>
      search === "" ||
      p.name.toLowerCase().includes(search) ||
      p.categoryName.toLowerCase().includes(search)
  );

  const clearSearch = () => setSearchParams({});

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the product");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={
          data
            ? query
              ? `${visible.length} of ${data.length} products match "${query}"`
              : `${data.length} ${data.length === 1 ? "product" : "products"} in your catalog`
            : undefined
        }
        actions={
          <>
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
              >
                Clear search
              </button>
            )}
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Plus size={16} />
              Add product
            </Link>
          </>
        }
      />

      {isPending && (
        <div className="animate-pulse space-y-3" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-14 rounded-lg bg-slate-100" />
          ))}
        </div>
      )}

      {isError && <QueryError message={error.message} onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
          No products yet. Add your first one.
        </p>
      )}

      {data && data.length > 0 && visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Nothing matches "{query}". Try a shorter word.
        </p>
      )}

      {visible.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((product) => {
                const confirming = confirmId === product.id;
                const deleting = deleteProduct.isPending && deleteProduct.variables === product.id;

                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          src={product.image}
                          alt=""
                          iconSize={20}
                          className="h-10 w-10 shrink-0 rounded-md bg-slate-100 p-0.5"
                        />
                        <span className="font-medium text-slate-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.categoryName}</td>
                    <td className="px-4 py-3 text-slate-800">{money(product.price)}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 5
                            ? "text-amber-600"
                            : "text-slate-700"
                      }`}
                    >
                      {product.stock}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirming ? (
                          <>
                            <span className="text-xs text-slate-600">Delete this product?</span>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => handleDelete(product.id)}
                              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deleting ? "Deleting..." : "Yes, delete"}
                            </button>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => setConfirmId(null)}
                              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand"
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              aria-label={`Edit ${product.name}`}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-brand-soft hover:text-brand"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              type="button"
                              aria-label={`Delete ${product.name}`}
                              onClick={() => setConfirmId(product.id)}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminProductsPage;