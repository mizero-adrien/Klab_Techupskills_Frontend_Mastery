import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../services/api";
import { orderService, type CreateOrderBody } from "../services/orderService";
import { toAdminOrdersResult, toOrder, toOrders } from "../lib/toOrders";
import { queryKeys } from "../lib/queryKeys";
import type { OrderStatus } from "../types/product";

export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: ({ signal }) => orderService.getMyOrders(signal),
    select: toOrders,
    staleTime: 30 * 1000,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id ?? ""),
    queryFn: ({ signal }) => orderService.getOrder(id as string, signal),
    select: toOrder,
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 2,
  });
}

export function useAdminOrders(params: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  q?: string;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const status = params.status;
  const q = params.q?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.orders.admin({ status, page, limit, q }),
    queryFn: ({ signal }) => orderService.getAllOrders({ status, page, limit, q }, signal),
    select: toAdminOrdersResult,
    staleTime: 30 * 1000,
  });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.adminDetail(id ?? ""),
    queryFn: ({ signal }) => orderService.getOrderAdmin(id as string, signal),
    select: toOrder,
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 2,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOrderBody) => orderService.createOrder(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      ]);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      ]);
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      ]);
    },
  });
}
