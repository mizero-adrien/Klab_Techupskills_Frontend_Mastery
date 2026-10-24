import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { orderService, type CreateOrderBody } from "../services/orderService";
import { toAdminOrdersView, toOrder, toOrders, type AdminOrdersView } from "../lib/toOrders";
import { queryKeys } from "../lib/queryKeys";
import type { ApiAdminOrdersPage, ApiOrder, OrderStatus } from "../types/order";

// ---------- Queries ----------

export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.mine(),
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
  });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.adminDetail(id ?? ""),
    queryFn: ({ signal }) => orderService.getOrderAdmin(id as string, signal),
    select: toOrder,
    enabled: Boolean(id),
  });
}

type AdminOrdersFilters = {
  status?: OrderStatus;
  q?: string;
  limit?: number;
};

const selectAdminOrders = (data: InfiniteData<ApiAdminOrdersPage, number>): AdminOrdersView =>
  toAdminOrdersView(data.pages);

export function useAdminOrders({ status, q = "", limit = 20 }: AdminOrdersFilters = {}) {
  const search = q.trim();

  return useInfiniteQuery({
    queryKey: queryKeys.orders.adminList({ status, q: search, limit }),
    queryFn: ({ pageParam, signal }) =>
      orderService.getAllOrders({ status, q: search, page: pageParam, limit }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.limit < lastPage.total ? lastPage.page + 1 : undefined,
    select: selectAdminOrders,
    staleTime: 30 * 1000,
  });
}

// ---------- Mutations ----------

// Orders and stock change together, so every order change refreshes both caches
function useRefreshAfterOrderChange() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    ]);
}

export function usePlaceOrder() {
  const refresh = useRefreshAfterOrderChange();

  return useMutation({
    mutationFn: async (body: CreateOrderBody) => toOrder(await orderService.createOrder(body)),
    onSuccess: refresh,
  });
}

export function useCancelOrder() {
  const refresh = useRefreshAfterOrderChange();

  return useMutation({
    mutationFn: async (id: string) => toOrder(await orderService.cancelOrder(id)),
    onSuccess: refresh,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const refresh = useRefreshAfterOrderChange();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) =>
      toOrder(await orderService.updateOrderStatus(id, status)),

    // 1. Before the request: show the new status immediately
    onMutate: async ({ id, status }) => {
      const key = queryKeys.orders.adminDetail(id);

      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ApiOrder>(key);

      if (previous) {
        queryClient.setQueryData<ApiOrder>(key, { ...previous, status });
      }

      return { previous };
    },

    // 2. If the server refuses: put the old order back
    onError: (_error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.orders.adminDetail(id), context.previous);
      }
    },

    // 3. Either way: sync with the server's real data
    onSettled: refresh,
  });
}
