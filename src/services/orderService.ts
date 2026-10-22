import api from "./api";
import type { ApiAdminOrdersResponse, ApiOrder, OrderStatus } from "../types/product";

export type CreateOrderBody = {
  items: { productId: string; quantity: number }[];
  delivery: { fullName: string; phone: string; address: string; city: string };
  paymentMethod: "momo" | "cash";
};

export type AdminOrdersParams = {
  status?: OrderStatus;
  page: number;
  limit: number;
  q: string;
};

export const orderService = {
  getMyOrders: async (signal?: AbortSignal): Promise<ApiOrder[]> => {
    const response = await api.get<ApiOrder[]>("/orders", { signal });
    return response.data;
  },

  getOrder: async (id: string, signal?: AbortSignal): Promise<ApiOrder> => {
    const response = await api.get<ApiOrder>(`/orders/${id}`, { signal });
    return response.data;
  },

  createOrder: async (body: CreateOrderBody): Promise<ApiOrder> => {
    const response = await api.post<ApiOrder>("/orders", body);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<ApiOrder> => {
    const response = await api.patch<ApiOrder>(`/orders/${id}/cancel`);
    return response.data;
  },

  getAllOrders: async (
    params: AdminOrdersParams,
    signal?: AbortSignal
  ): Promise<ApiAdminOrdersResponse> => {
    const response = await api.get<ApiAdminOrdersResponse>("/orders/admin/all", {
      params,
      signal,
    });
    return response.data;
  },

  getOrderAdmin: async (id: string, signal?: AbortSignal): Promise<ApiOrder> => {
    const response = await api.get<ApiOrder>(`/orders/admin/${id}`, { signal });
    return response.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<ApiOrder> => {
    const response = await api.patch<ApiOrder>(`/orders/admin/${id}/status`, { status });
    return response.data;
  },
};
