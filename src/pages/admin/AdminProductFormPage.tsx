import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm, type RegisterOptions } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProductMutations";
import { ApiError } from "../../services/api";
import type { Product } from "../../lib/toProducts";
import type { Category } from "../../types/product";
import FormField from "../../components/ui/FormField";
import ProductImage from "../../components/ui/ProductImage";
import QueryError from "../../components/ui/QueryError";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type FormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};

const FIELD_NAMES: string[] = ["name", "description", "price", "stock", "category"];
const isFormField = (field: string): field is keyof FormValues => FIELD_NAMES.includes(field);

// These mirror product.schema.ts on the server
const rules: { [K in keyof FormValues]: RegisterOptions<FormValues, K> } = {
  name: {
    required: "Enter the product name.",
    minLength: { value: 2, message: "Name must be at least 2 characters." },
    maxLength: { value: 100, message: "Name must be at most 100 characters." },
  },
  description: {
    maxLength: { value: 1000, message: "Description must be at most 1000 characters." },
  },
  price: {
    required: "Enter a price.",
    validate: {
      number: (v) => !Number.isNaN(Number(v)) || "Price must be a number.",
      positive: (v) => Number(v) >= 0 || "Price cannot be negative.",
    },
  },
  stock: {
    required: "Enter the stock quantity.",
    validate: {
      whole: (v) => Number.isInteger(Number(v)) || "Stock must be a whole number.",
      positive: (v) => Number(v) >= 0 || "Stock cannot be negative.",
    },
  },
  category: { required: "Choose a category." },
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

type ProductFormProps = { product?: Product; categories: Category[] };

function ProductForm({ product, categories }: ProductFormProps) {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = Boolean(product);

  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "0",
      category: product?.categoryId ?? "",
    },
  });

  // Free the temporary preview address when the picture changes or the page closes
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 5 MB or smaller.");
      return;
    }

    setImageError("");
    setImage({ file, url: URL.createObjectURL(file) });
  };

  const onSubmit = async (values: FormValues) => {
    setServerError("");

    const body = new FormData();
    body.append("name", values.name.trim());
    if (isEdit || values.description.trim()) body.append("description", values.description.trim());
    body.append("price", values.price.trim());
    body.append("stock", values.stock.trim());
    body.append("category", values.category);
    if (image) body.append("image", image.file);

    try {
      if (product) await updateProduct.mutateAsync({ id: product.id, body });
      else await createProduct.mutateAsync(body);

      toast.success(product ? "Product updated" : "Product created");
      navigate("/admin/products");
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        let general = "";
        error.fieldErrors.forEach(({ field, message }) => {
          if (isFormField(field)) setError(field, { type: "server", message });
          else general = message;
        });
        if (general) setServerError(general);
        return;
      }
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const previewSrc = image?.url ?? product?.image;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_300px]"
    >
      <div className="space-y-4 rounded-lg border border-slate-100 p-5">
        <FormField id="name" label="Name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            aria-invalid={errors.name ? true : undefined}
            className={inputClass}
            {...register("name", rules.name)}
          />
        </FormField>

        <FormField
          id="description"
          label="Description (optional)"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            rows={5}
            aria-invalid={errors.description ? true : undefined}
            className={inputClass}
            {...register("description", rules.description)}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="price" label="Price (Rwf)" error={errors.price?.message}>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              aria-invalid={errors.price ? true : undefined}
              className={inputClass}
              {...register("price", rules.price)}
            />
          </FormField>

          <FormField id="stock" label="Stock" error={errors.stock?.message}>
            <input
              id="stock"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              aria-invalid={errors.stock ? true : undefined}
              className={inputClass}
              {...register("stock", rules.stock)}
            />
          </FormField>
        </div>

        <FormField
          id="category"
          label="Category"
          error={errors.category?.message}
          hint={categories.length === 0 ? "No categories exist yet. Create one first." : undefined}
        >
          <select
            id="category"
            aria-invalid={errors.category ? true : undefined}
            className={inputClass}
            {...register("category", rules.category)}
          >
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="space-y-4 self-start">
        <div className="rounded-lg border border-slate-100 p-5">
          <p className="text-sm font-semibold text-slate-800">Product image</p>

          <div className="mt-3 flex h-48 items-center justify-center rounded-lg bg-slate-100">
            <ProductImage
              key={previewSrc ?? "none"}
              src={previewSrc}
              alt="Product preview"
              iconSize={48}
              className="h-full w-full p-3"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label
              htmlFor="image"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 focus-within:ring-2 focus-within:ring-brand hover:border-brand hover:text-brand"
            >
              <ImagePlus size={14} />
              {previewSrc ? "Change image" : "Choose image"}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="sr-only"
              />
            </label>

            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-xs font-medium text-slate-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          {imageError ? (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {imageError}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">JPG, PNG or WebP, up to 5 MB.</p>
          )}
        </div>

        {serverError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {serverError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link
            to="/admin/products"
            className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand"
          >
            Cancel
          </Link>
        </div>

        {isSubmitting && (
          <p className="text-xs text-slate-500">
            Uploading. The server may take a moment to wake up.
          </p>
        )}
      </div>
    </form>
  );
}

function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const categoriesQuery = useCategories();
  const productQuery = useProduct(id);

  const title = isEdit ? "Edit product" : "Add product";

  const header = (
    <AdminPageHeader
      title={title}
      actions={
        <Link
          to="/admin/products"
          className="text-sm font-medium text-slate-600 hover:text-brand"
        >
          ← Back to products
        </Link>
      }
    />
  );

  if (categoriesQuery.isError) {
    return (
      <>
        {header}
        <QueryError message={categoriesQuery.error.message} onRetry={() => categoriesQuery.refetch()} />
      </>
    );
  }

  if (isEdit && productQuery.isError) {
    const notFound = productQuery.error instanceof ApiError && productQuery.error.status === 404;

    return (
      <>
        {header}
        {notFound ? (
          <p className="py-12 text-center text-sm text-slate-500">That product doesn't exist anymore.</p>
        ) : (
          <QueryError message={productQuery.error.message} onRetry={() => productQuery.refetch()} />
        )}
      </>
    );
  }

  const categories = categoriesQuery.data;
  const product = productQuery.data;

  if (!categories || (isEdit && !product)) {
    return (
      <>
        {header}
        <div className="grid animate-pulse gap-6 lg:grid-cols-[1fr_300px]" aria-busy="true">
          <div className="h-80 rounded-lg bg-slate-100" />
          <div className="h-64 rounded-lg bg-slate-100" />
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      <ProductForm key={id ?? "new"} product={product} categories={categories} />
    </>
  );
}

export default AdminProductFormPage;