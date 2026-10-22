import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../services/api";
import { productService } from "../services/productService";
import { queryKeys } from "../lib/queryKeys";
import { toProduct } from "../lib/toProducts";
import type { ApiProduct } from "../types/product";

const toProducts = (list: ApiProduct[]) => list.map(toProduct);

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: ({ signal }) => productService.getProducts(signal),
    select: toProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ""),
    queryFn: ({ signal }) => productService.getProduct(id as string, signal),
    select: toProduct,
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 2,
  });
}