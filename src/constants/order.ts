import type { OrderStatus, PaymentMethod } from "../types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  momo: "Mobile Money",
  cash: "Cash on delivery",
};

// Matches the backend rule: customers can only cancel orders that are still pending
export const CUSTOMER_CANCELLABLE: readonly OrderStatus[] = ["pending"];