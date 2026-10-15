import { Link } from "react-router";
import { Minus, Plus, Smartphone, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductsImage";

function CartPage() {
  const { items, totalItems, totalPrice, changeQuantity, removeFromCart } = useCart();
  const { user, openLogin } = useAuth();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Add a product to see it here.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-5 py-2 text-sm font-medium text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  const originalTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.oldPrice * quantity,
    0
  );
  const totalSavings = originalTotal - totalPrice;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">
        Your cart ({totalItems})
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-slate-100 self-start rounded-lg border border-slate-100">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                <Smartphone size={28} strokeWidth={1} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{product.name}</p>
                <p className="text-xs text-slate-500">{money(product.price)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${product.name}`}
                  onClick={() => changeQuantity(product.id, -1)}
                  className="rounded-full border border-slate-200 p-1 text-slate-600 hover:border-brand hover:text-brand"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${product.name}`}
                  onClick={() => changeQuantity(product.id, 1)}
                  className="rounded-full border border-slate-200 p-1 text-slate-600 hover:border-brand hover:text-brand"
                >
                  <Plus size={14} />
                </button>
              </div>

              <p className="w-28 text-right text-sm font-semibold text-slate-900">
                {money(product.price * quantity)}
              </p>

              <button
                type="button"
                aria-label={`Remove ${product.name}`}
                onClick={() => removeFromCart(product.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="self-start rounded-lg border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800">Order summary</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Items ({totalItems})</dt>
              <dd className="text-slate-700">{money(originalTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Discount</dt>
              <dd className="font-medium text-green-600">- {money(totalSavings)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
              <dt>Total</dt>
              <dd>{money(totalPrice)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => {
              if (!user) openLogin();
              // when signed in, we'll send the user to checkout later
            }}
            className="mt-5 block w-full rounded-md bg-brand py-2.5 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Proceed to checkout
          </button>
          <Link
            to="/products"
            className="mt-3 block text-center text-xs font-medium text-brand hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;