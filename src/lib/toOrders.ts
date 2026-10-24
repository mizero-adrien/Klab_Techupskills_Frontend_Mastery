import type {
  ApiAdminOrdersPage,
  ApiOrder,
  ApiOrderItem,
  Delivery,
  OrderStatus,
  PaymentMethod,
} from "../types/order";

export type OrderItem = {
  productId: string | null;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  itemCount: number;
  total: number;
  status: OrderStatus;
  delivery: Delivery;
  payment: PaymentMethod;
  createdAt: string;
};

export type AdminOrdersView = {
  orders: Order[];
  total: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingOrders: number;
};

const productIdOf = (product: ApiOrderItem["product"]): string | null => {
  if (product === null) return null;
  return typeof product === "string" ? product : product._id;
};

export function toOrder(order: ApiOrder): Order {
  const items: OrderItem[] = order.items.map((item) => ({
    productId: productIdOf(item.product),
    name: item.productName,
    image: item.productImage,
    unitPrice: item.priceAtPurchase,
    quantity: item.quantity,
    lineTotal: item.priceAtPurchase * item.quantity,
  }));

  return {
    id: order._id,
    reference: order._id.slice(-8).toUpperCase(),
    customerName: order.userName,
    customerEmail: order.userEmail,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.totalAmount,
    status: order.status,
    delivery: order.delivery,
    payment: order.paymentMethod,
    createdAt: order.createdAt,
  };
}

export const toOrders = (orders: ApiOrder[]): Order[] => orders.map(toOrder);

const NO_ORDERS: Record<OrderStatus, number> = {
  pending: 0,
  paid: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

export function toAdminOrdersView(pages: ApiAdminOrdersPage[]): AdminOrdersView {
  const first = pages[0];

  return {
    orders: pages.flatMap((page) => page.items.map(toOrder)),
    total: first?.total ?? 0,
    statusCounts: first?.statusCounts ?? NO_ORDERS,
    totalRevenue: first?.totalRevenue ?? 0,
    pendingOrders: first?.pendingOrders ?? 0,
  };
}