import { Link, useNavigate } from "react-router";
import { useForm, type RegisterOptions } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useOrders";
import { PAYMENT_LABELS } from "../constants/order";
import { ApiError } from "../services/api";
import type { PaymentMethod } from "../types/order";
import { money } from "../utils/money";
import FormField from "../components/ui/FormField";
import ProductImage from "../components/ui/ProductImage";
import { useState } from "react";

type FormValues = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
};

const FIELD_NAMES = ["fullName", "phone", "address", "city", "paymentMethod"] as const;

// The server reports delivery errors as "delivery.phone", so we strip the prefix
const toFormField = (field: string): keyof FormValues | null => {
  const name = field.replace(/^delivery\./, "");
  return (FIELD_NAMES as readonly string[]).includes(name) ? (name as keyof FormValues) : null;
};

const stripSpaces = (value: string) => value.replace(/[\s()-]/g, "");

const rules: { [K in keyof FormValues]: RegisterOptions<FormValues, K> } = {
  fullName: {
    required: "Enter your full name.",
    minLength: { value: 2, message: "Name must be at least 2 characters." },
    maxLength: { value: 100, message: "Name must be at most 100 characters." },
  },
  phone: {
    required: "Enter your phone number.",
    validate: (value) => {
      const length = stripSpaces(value).length;
      return (length >= 9 && length <= 13) || "Enter a valid phone number (9 to 13 digits).";
    },
  },
  address: {
    required: "Enter your delivery address.",
    minLength: { value: 5, message: "Address must be at least 5 characters." },
    maxLength: { value: 200, message: "Address must be at most 200 characters." },
  },
  city: {
    required: "Enter your city.",
    minLength: { value: 2, message: "City must be at least 2 characters." },
    maxLength: { value: 50, message: "City must be at most 50 characters." },
  },
  paymentMethod: { required: "Choose a payment method." },
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

const PAYMENT_HINTS: Record<PaymentMethod, string> = {
  momo: "Pay with your phone when we confirm the order.",
  cash: "Pay the courier when your order arrives.",
};

type CheckoutFormProps = { userName: string };

function CheckoutForm({ userName }: CheckoutFormProps) {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: userName,
      phone: "",
      address: "",
      city: "Kigali",
      paymentMethod: "momo",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");

    try {
      const order = await placeOrder.mutateAsync({
        // Only ids and quantities: the server decides every price
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
        delivery: {
          fullName: values.fullName.trim(),
          phone: stripSpaces(values.phone),
          address: values.address.trim(),
          city: values.city.trim(),
        },
        paymentMethod: values.paymentMethod,
      });

      toast.success("Order placed");
      navigate(`/order-success/${order.id}`, { replace: true });
      clearCart();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        let general = "";
        error.fieldErrors.forEach(({ field, message }) => {
          const name = toFormField(field);
          if (name) setError(name, { type: "server", message });
          else general = message;
        });
        if (general) setServerError(general);
        return;
      }

      setServerError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_340px]"
    >
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-slate-100 p-5">
          <legend className="px-2 text-base font-semibold text-slate-800">
            Delivery details
          </legend>

          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                aria-invalid={errors.fullName ? true : undefined}
                className={inputClass}
                {...register("fullName", rules.fullName)}
              />
            </FormField>

            <FormField id="phone" label="Phone number" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+250 7XX XXX XXX"
                aria-invalid={errors.phone ? true : undefined}
                className={inputClass}
                {...register("phone", rules.phone)}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField id="address" label="Address" error={errors.address?.message}>
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Street, house number, landmark"
                  aria-invalid={errors.address ? true : undefined}
                  className={inputClass}
                  {...register("address", rules.address)}
                />
              </FormField>
            </div>

            <FormField id="city" label="City" error={errors.city?.message}>
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                aria-invalid={errors.city ? true : undefined}
                className={inputClass}
                {...register("city", rules.city)}
              />
            </FormField>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-slate-100 p-5">
          <legend className="px-2 text-base font-semibold text-slate-800">Payment method</legend>

          <div className="mt-2 space-y-3">
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
              >
                <input
                  type="radio"
                  value={method}
                  className="mt-1 accent-brand"
                  {...register("paymentMethod", rules.paymentMethod)}
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {PAYMENT_LABELS[method]}
                  </span>
                  <span className="block text-xs text-slate-500">{PAYMENT_HINTS[method]}</span>
                </span>
              </label>
            ))}
          </div>

          {errors.paymentMethod && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {errors.paymentMethod.message}
            </p>
          )}
        </fieldset>
      </div>

      <aside className="self-start rounded-lg border border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-800">Order summary ({totalItems})</h2>

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

        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{money(totalPrice)}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          The final price is confirmed by our server when you place the order.
        </p>

        {serverError && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>

        {isSubmitting && (
          <p className="mt-2 text-center text-xs text-slate-500">
            The server may take a moment to wake up.
          </p>
        )}

        <Link
          to="/cart"
          className="mt-3 block text-center text-xs font-medium text-brand hover:underline"
        >
          Back to cart
        </Link>
      </aside>
    </form>
  );
}

function CheckoutPage() {
  const { user, openLogin } = useAuth();
  const { items } = useCart();

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

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">Checkout</h1>
      <CheckoutForm key={user.id} userName={user.name} />
    </section>
  );
}

export default CheckoutPage;