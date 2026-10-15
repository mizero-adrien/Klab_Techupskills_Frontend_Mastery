import { createContext, useContext, type ReactNode } from "react";
import type { Deal } from "../data/Home";
import { useLocalStorage } from "../hooks/useLocalStorage";

type CartItem = { product: Deal; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Deal) => void;
  changeQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = (product: Deal) => {
    setItems((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const changeQuantity = (id: number, delta: number) => {
    setItems((current) =>
      current
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setItems((current) => current.filter((i) => i.product.id !== id));
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, changeQuantity, removeFromCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}