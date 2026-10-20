import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductsImage";

type FormValues = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  payment: "momo" | "cash";
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) errors.phone = "Enter a valid phone number.";
  if (values.address.trim().length < 5) errors.address = "Enter your delivery address.";
  if (values.city.trim().length < 2) errors.city = "Enter your city.";
  return errors;
}

type FieldProps = {
  label: string;
  name: keyof FormValues;
  value: string;
  error?: string;
  placeholder?: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Field({ label, name, value, error, placeholder, type = "text", onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, openLogin } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    fullName: user?.name ?? "",
    phone: "",
    address: "",
    city: "Kigali",
    payment: "momo",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sign in to check out</h1>
        <p className="mt-2 text-sm text-slate-500">
          We need an account to keep track of your order.
        </p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Sign in
        </button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Add something before you check out.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  const originalTotal = items.reduce(
    (sum, { product, quantity }) => sum + (product.oldPrice ?? product.price) * quantity,
    0
  );
  const savings = originalTotal - totalPrice;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const orderId = placeOrder({
  userEmail: user.email,
  items,
  total: totalPrice,
  savings,
  payment: values.payment,
  delivery: {
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    city: values.city.trim(),
  },
});

    navigate(`/order-success/${orderId}`, { replace: true });
    clearCart();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-6 lg:grid-cols-[1fr_340px]"
      >
        <div className="space-y-6">
          <fieldset className="rounded-lg border border-slate-100 p-5">
            <legend className="px-2 text-base font-semibold text-slate-800">
              Delivery details
            </legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" value={values.fullName} error={errors.fullName} onChange={handleChange} />
              <Field label="Phone number" name="phone" type="tel" placeholder="+250 7XX XXX XXX" value={values.phone} error={errors.phone} onChange={handleChange} />
              <div className="sm:col-span-2">
                <Field label="Address" name="address" placeholder="Street, house number, landmark" value={values.address} error={errors.address} onChange={handleChange} />
              </div>
              <Field label="City" name="city" value={values.city} error={errors.city} onChange={handleChange} />
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 p-5">
            <legend className="px-2 text-base font-semibold text-slate-800">
              Payment method
            </legend>
            <div className="mt-2 space-y-3">
              {(
                [
                  { value: "momo", title: "Mobile Money", hint: "Pay with your phone when we confirm the order." },
                  { value: "cash", title: "Cash on delivery", hint: "Pay the courier when your order arrives." },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                    values.payment === option.value
                      ? "border-brand bg-brand-soft"
                      : "border-slate-200 hover:border-brand"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={values.payment === option.value}
                    onChange={handleChange}
                    className="mt-1 accent-brand"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{option.title}</span>
                    <span className="block text-xs text-slate-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="self-start rounded-lg border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-800">
            Order summary ({totalItems})
          </h2>

          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <ProductImage
                  src={product.image}
                  alt=""
                  iconSize={20}
                  className="h-12 w-12 shrink-0 rounded-md bg-slate-100 p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-800">{product.name}</p>
                  <p className="text-xs text-slate-500">Qty {quantity}</p>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  {money(product.price * quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Discount</dt>
              <dd className="font-medium text-green-600">- {money(savings)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <dt>Total</dt>
              <dd>{money(totalPrice)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Place order
          </button>
          <Link
            to="/cart"
            className="mt-3 block text-center text-xs font-medium text-brand hover:underline"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </section>
  );
}

export default CheckoutPage;