import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "../../hooks/useCategories";
import { useDeleteCategory } from "../../hooks/useCategoryMutations";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import QueryError from "../../components/ui/QueryError";

function AdminCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const { data, isPending, isError, error, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const search = query.toLowerCase();
  const visible = (data ?? []).filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search) ||
      (c.description && c.description.toLowerCase().includes(search))
  );

  const clearSearch = () => setSearchParams({});

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the category");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description={
          data
            ? query
              ? `${visible.length} of ${data.length} categories match "${query}"`
              : `${data.length} ${data.length === 1 ? "category" : "categories"} in your catalog`
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
              to="/admin/categories/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Plus size={16} />
              Add category
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
          No categories yet. Add your first one.
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((category) => {
                const confirming = confirmId === category._id;
                const deleting = deleteCategory.isPending && deleteCategory.variables === category._id;

                return (
                  <tr key={category._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{category.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {category.description || (
                        <span className="text-slate-400 italic">No description</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{category.productCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {confirming ? (
                          <>
                            <span className="text-xs text-slate-600">Delete this category?</span>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => handleDelete(category._id)}
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
                              to={`/admin/categories/${category._id}/edit`}
                              aria-label={`Edit ${category.name}`}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-brand-soft hover:text-brand"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              type="button"
                              aria-label={`Delete ${category.name}`}
                              onClick={() => setConfirmId(category._id)}
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

export default AdminCategoriesPage;
