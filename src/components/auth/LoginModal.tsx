import { useEffect, useState, type ReactNode } from "react";
import { useForm, type RegisterOptions } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../services/api";
import { BRAND_NAME } from "../../config/brand";

type FormValues = { name: string; email: string; password: string };

const isFormField = (field: string): field is keyof FormValues =>
  field === "name" || field === "email" || field === "password";

const signupPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: "Enter a password.",
  minLength: { value: 8, message: "Password must be at least 8 characters." },
  maxLength: { value: 72, message: "Password must be at most 72 characters." },
  validate: {
    hasLetter: (v) => /[A-Za-z]/.test(v) || "Password must contain at least one letter.",
    hasNumber: (v) => /[0-9]/.test(v) || "Password must contain at least one number.",
  },
};

const signinPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: "Enter your password.",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

type FieldProps = { id: string; label: string; error?: string; hint?: string; children: ReactNode };

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

function LoginDialog() {
  const { closeLogin, login, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ shouldUnregister: true });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeLogin]);

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    const email = values.email.trim();

    try {
      if (mode === "signup") {
        await signUp({ name: values.name.trim(), email, password: values.password });
        toast.success("Account created. Welcome!");
      } else {
        await login({ email, password: values.password });
        toast.success("Signed in");
      }
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        let general = "";
        error.fieldErrors.forEach(({ field, message }) => {
          if (isFormField(field)) setError(field, { type: "server", message });
          else general = message;
        });
        if (general) setServerError(general);
        return;
      }
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setServerError("");
    clearErrors();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLogin();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={closeLogin}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <p className="text-xl font-bold text-brand">{BRAND_NAME}</p>
        <h2 id="login-title" className="mt-4 text-lg font-semibold text-slate-800">
          {mode === "signin" ? "Sign in to your account" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
          {mode === "signup" && (
            <Field id="name" label="Full name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                autoFocus
                aria-invalid={errors.name ? true : undefined}
                className={inputClass}
                {...register("name", {
                  required: "Please enter your name.",
                  minLength: { value: 2, message: "Name must be at least 2 characters." },
                  maxLength: { value: 50, message: "Name must be at most 50 characters." },
                })}
              />
            </Field>
          )}

          <Field id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus={mode === "signin"}
              aria-invalid={errors.email ? true : undefined}
              className={inputClass}
              {...register("email", {
                required: "Enter your email address.",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
              })}
            />
          </Field>

          <Field
            id="password"
            label="Password"
            error={errors.password?.message}
            hint={mode === "signup" ? "At least 8 characters, with a letter and a number." : undefined}
          >
            <input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              aria-invalid={errors.password ? true : undefined}
              className={inputClass}
              {...register("password", mode === "signup" ? signupPasswordRules : signinPasswordRules)}
            />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          {isSubmitting && (
            <p className="text-center text-xs text-slate-500">
              The server may take a moment to wake up.
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          {mode === "signin" ? "No account yet? " : "Already registered? "}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-brand hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginModal() {
  const { isLoginOpen } = useAuth();
  if (!isLoginOpen) return null;
  return <LoginDialog />;
}

export default LoginModal;