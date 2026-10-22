import { Link, useNavigate } from "react-router";
import { useForm, useWatch, type RegisterOptions } from "react-hook-form";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { usePlaceOrder } from "../hooks/useOrders";
import { ApiError } from "../services/api";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductImage";
import FormField from "../components/ui/FormField";
import { useState } from "react";

type FormValues = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  payment: "momo" | "cash";
};

const rules: { [K in keyof FormValues]: RegisterOptions<FormValues, K> } = {
  fullName: {
    required: "Enter your full name.",
    minLength: { value: 2, message: "Name must be at least 2 characters." },
    maxLength: { value: 100, message: "Name must be at most 100 characters." },
  },
  phone: {
    required: "Enter your phone number.",
    pattern: {
      value: /^\d{9,13}$/,
      message: "Enter a valid phone number (9-13 digits).",
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
  payment: {
    required: "Choose a payment method.",
  },
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, openLogin } = useAuth();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: user?.name ?? "",
      phone: "",
      address: "",
      city: "Kigali",
      payment: "momo",
    },
  });

  const paymentValue = useWatch({ control, name: "payment" });

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

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      const order = await placeOrder.mutateAsync({
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
        delivery: {
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
        },
        paymentMethod: values.payment,
      });

      clearCart();

      toast.success("Order placed successfully");
      navigate(`/order-success/${order._id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        for (const fieldError of error.fieldErrors) {
          if (fieldError.field.startsWith("delivery.")) {
            const formField = fieldError.field.slice("delivery.".length) as keyof FormValues;
            if (formField === "fullName" || formField === "phone" || formField === "address" || formField === "city") {
              setError(formField, { type: "server", message: fieldError.message });
            }
          }
        }
      }

      const message =
        error instanceof ApiError && error.status === 409
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to place order";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">Checkout</h1>

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
                  aria-invalid={errors.fullName ? true : undefined}
                  className={inputClass}
                  {...register("fullName", rules.fullName)}
                />
              </FormField>
              <FormField id="phone" label="Phone number" error={errors.phone?.message}>
                <input
                  id="phone"
                  type="tel"
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
                  aria-invalid={errors.city ? true : undefined}
                  className={inputClass}
                  {...register("city", rules.city)}
                />
              </FormField>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-100 p-5">
            <legend className="px-2 text-base font-semibold text-slate-800">
              Payment method
            </legend>
            <div className="mt-2 space-y-3">
              {[
                { value: "momo" as const, title: "Mobile Money", hint: "Pay with your phone when we confirm the order." },
                { value: "cash" as const, title: "Cash on delivery", hint: "Pay the courier when your order arrives." },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                    paymentValue === option.value
                      ? "border-brand bg-brand-soft"
                      : "border-slate-200 hover:border-brand"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    aria-invalid={errors.payment ? true : undefined}
                    className="mt-1 accent-brand"
                    {...register("payment", rules.payment)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{option.title}</span>
                    <span className="block text-xs text-slate-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.payment && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {errors.payment.message}
              </p>
            )}
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

          {serverError && (
            <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || placeOrder.isPending}
            className="mt-5 w-full rounded-md bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting || placeOrder.isPending ? "Placing order..." : "Place order"}
          </button>
          {(isSubmitting || placeOrder.isPending) && (
            <p className="mt-2 text-xs text-slate-500">
              This can take a moment if the backend is waking up.
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
    </section>
  );
}

export default CheckoutPage;