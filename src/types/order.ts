export const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = "momo" | "cash";

export type Delivery = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
};

export type ApiOrderItem = {
  // A full product when the server populated it, a bare id right after an order
  // is created, or null if the product was deleted later
  product: string | { _id: string } | null;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productImage?: string;
};

export type ApiOrder = {
  _id: string;
  user: string;
  userName: string;
  userEmail: string;
  items: ApiOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  delivery: Delivery;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

export type ApiAdminOrdersPage = {
  items: ApiOrder[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingOrders: number;
};