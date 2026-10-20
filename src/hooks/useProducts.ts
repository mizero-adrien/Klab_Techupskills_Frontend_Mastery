import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "../lib/api";
import { toProduct } from "../lib/toProducts";
import type { ApiProduct } from "../types/product";

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

const toProducts = (list: ApiProduct[]) => list.map(toProduct);

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: ({ signal }) => api<ApiProduct[]>("/products", { signal }),
    select: toProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: ({ signal }) => api<ApiProduct>(`/products/${id}`, { signal }),
    select: toProduct,
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 2,
  });
}