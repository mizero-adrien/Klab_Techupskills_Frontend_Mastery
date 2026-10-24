import api from "./api";
import type {
  ApiAdminOrdersPage,
  ApiOrder,
  Delivery,
  OrderStatus,
  PaymentMethod,
} from "../types/order";

export type CreateOrderBody = {
  items: { productId: string; quantity: number }[];
  delivery: Delivery;
  paymentMethod: PaymentMethod;
};

export type AdminOrdersQuery = {
  status?: OrderStatus;
  q?: string;
  page: number;
  limit: number;
};

export const orderService = {
  // Customer
  createOrder: async (body: CreateOrderBody): Promise<ApiOrder> => {
    const response = await api.post<ApiOrder>("/orders", body);
    return response.data;
  },

  getMyOrders: async (signal?: AbortSignal): Promise<ApiOrder[]> => {
    const response = await api.get<ApiOrder[]>("/orders", { signal });
    return response.data;
  },

  getOrder: async (id: string, signal?: AbortSignal): Promise<ApiOrder> => {
    const response = await api.get<ApiOrder>(`/orders/${id}`, { signal });
    return response.data;
  },

  cancelOrder: async (id: string): Promise<ApiOrder> => {
    const response = await api.patch<ApiOrder>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin
  getAllOrders: async (
    { status, q, page, limit }: AdminOrdersQuery,
    signal?: AbortSignal
  ): Promise<ApiAdminOrdersPage> => {
    const response = await api.get<ApiAdminOrdersPage>("/orders/admin/all", {
      params: { status, q: q || undefined, page, limit },
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
