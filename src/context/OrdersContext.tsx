import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { CartItem } from "./CartContext";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  savings: number;
  payment: "momo" | "cash";
  delivery: { fullName: string; phone: string; address: string; city: string };
};

type NewOrder = Omit<Order, "id" | "createdAt">;

type OrdersContextValue = {
  orders: Order[];
  placeOrder: (order: NewOrder) => string;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);

  const placeOrder = (order: NewOrder) => {
    const id = `TM-${Date.now().toString(36).toUpperCase()}`;
    const newOrder: Order = { ...order, id, createdAt: new Date().toISOString() };
    setOrders((current) => [newOrder, ...current]);
    return id;
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used inside <OrdersProvider>");
  return context;
}