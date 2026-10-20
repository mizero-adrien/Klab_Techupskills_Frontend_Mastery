import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category } from "../types/product";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: ({ signal }) => api<Category[]>("/categories", { signal }),
    staleTime: 5 * 60 * 1000,
  });
}