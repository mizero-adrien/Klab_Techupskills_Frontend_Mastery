export type Category = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category | string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiOrderItem = {
  product: string;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productImage?: string;
};

export type ApiDelivery = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
};

export type ApiOrder = {
  _id: string;
  user: string;
  userName: string;
  userEmail: string;
  items: ApiOrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  delivery: ApiDelivery;
  paymentMethod: "momo" | "cash";
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = ApiOrder["status"];

export type ApiAdminOrdersResponse = {
  items: ApiOrder[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingOrders: number;
};