import type { OrderStatus } from "../types/product";

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
    list: () => [...queryKeys.orders.all, "list"] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    admin: (params: { status?: OrderStatus; page: number; limit: number; q: string }) =>
      [...queryKeys.orders.all, "admin", params] as const,
    adminDetail: (id: string) => [...queryKeys.orders.all, "admin", "detail", id] as const,
  },
};
