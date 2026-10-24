import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Product } from "../lib/toProducts";
import { CART_STORAGE_KEY } from "../constants/cart";
import { cartReducer, loadCart, type CartItem } from "./cartReducer";

export type { CartItem };

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  changeQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be full or blocked. The cart still works in memory.
    }
  }, [items]);

  // dispatch never changes, so these functions keep the same identity forever
  const actions = useMemo(
    () => ({
      addToCart: (product: Product, quantity = 1) => dispatch({ type: "ADD", product, quantity }),
      changeQuantity: (id: string, delta: number) =>
        dispatch({ type: "CHANGE_QUANTITY", id, delta }),
      removeFromCart: (id: string) => dispatch({ type: "REMOVE", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    []
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ...actions,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    [items, actions]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}