import type { Product } from "../lib/toProducts";
import { assertNever } from "../utils/assertNever";
import { CART_STORAGE_KEY } from "../constants/cart";

export type CartItem = { product: Product; quantity: number };
export type CartState = CartItem[];

export type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "CHANGE_QUANTITY"; id: string; delta: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const { product, quantity } = action;
      if (quantity < 1 || product.stock <= 0) return state;

      const existing = state.find((item) => item.product.id === product.id);
      if (!existing) {
        return [...state, { product, quantity: Math.min(quantity, product.stock) }];
      }

      // Re-adding also refreshes the saved copy of the product (price, stock)
      return state.map((item) =>
        item.product.id === product.id
          ? { product, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      );
    }

    case "CHANGE_QUANTITY":
      return state.flatMap((item) => {
        if (item.product.id !== action.id) return [item];

        const next = Math.min(item.quantity + action.delta, item.product.stock);
        return next > 0 ? [{ ...item, quantity: next }] : [];
      });

    case "REMOVE":
      return state.filter((item) => item.product.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return assertNever(action);
  }
}

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;

  const { product, quantity } = value as { product?: unknown; quantity?: unknown };
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) return false;
  if (typeof product !== "object" || product === null) return false;

  const p = product as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.price === "number" &&
    typeof p.stock === "number"
  );
};

// Used as the lazy initializer of useReducer
export function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}