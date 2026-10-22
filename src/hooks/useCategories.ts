import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../services/api";
import { categoryService } from "../services/categoryService";
import { queryKeys } from "../lib/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: ({ signal }) => categoryService.getCategories(signal),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id ?? ""),
    queryFn: ({ signal }) => categoryService.getCategory(id as string, signal),
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 2,
  });
}
