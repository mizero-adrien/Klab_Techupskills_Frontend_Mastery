import type { ApiOrder, ApiOrderItem, ApiDelivery, ApiAdminOrdersResponse, OrderStatus } from "../types/product";

export type OrderItem = {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  priceAtPurchase: number;
};

export type Delivery = ApiDelivery;

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  delivery: Delivery;
  paymentMethod: "momo" | "cash";
  createdAt: string;
  updatedAt: string;
};

export type AdminOrdersResult = {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingOrders: number;
};

export const toOrderItem = (item: ApiOrderItem): OrderItem => ({
  productId: item.product,
  productName: item.productName,
  productImage: item.productImage,
  quantity: item.quantity,
  priceAtPurchase: item.priceAtPurchase,
});

export const toOrder = (order: ApiOrder): Order => ({
  id: order._id,
  userId: order.user,
  userName: order.userName,
  userEmail: order.userEmail,
  items: order.items.map(toOrderItem),
  totalAmount: order.totalAmount,
  status: order.status,
  delivery: order.delivery,
  paymentMethod: order.paymentMethod,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

export const toOrders = (orders: ApiOrder[]): Order[] => orders.map(toOrder);

export const toAdminOrdersResult = (data: ApiAdminOrdersResponse): AdminOrdersResult => ({
  items: data.items.map(toOrder),
  total: data.total,
  page: data.page,
  limit: data.limit,
  statusCounts: data.statusCounts,
  totalRevenue: data.totalRevenue,
  pendingOrders: data.pendingOrders,
});
