import type { OrderStatus } from "../types/order";

export type AdminOrderFilters = {
  status?: OrderStatus;
  q: string;
  limit: number;
};

export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    detail: (id: string) => [...queryKeys.products.all, "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => [...queryKeys.categories.all, "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    mine: () => [...queryKeys.orders.all, "mine"] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    adminLists: () => [...queryKeys.orders.all, "admin", "list"] as const,
    adminList: (filters: AdminOrderFilters) =>
      [...queryKeys.orders.adminLists(), filters] as const,
    adminDetail: (id: string) => [...queryKeys.orders.all, "admin", "detail", id] as const,
  },
};