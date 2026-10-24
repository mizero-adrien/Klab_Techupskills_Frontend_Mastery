import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm, type RegisterOptions } from "react-hook-form";
import { CircleCheck, Link2Off } from "lucide-react";
import toast from "react-hot-toast";
import { useResetPassword } from "../hooks/useAuthMutations";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";
import FormField from "../components/ui/FormField";

type FormValues = { password: string; confirm: string };
type Screen = "form" | "done" | "invalid-link";

const passwordRules: RegisterOptions<FormValues, "password"> = {
  required: "Enter a new password.",
  minLength: { value: 8, message: "Password must be at least 8 characters." },
  maxLength: { value: 72, message: "Password must be at most 72 characters." },
  validate: {
    hasLetter: (v) => /[A-Za-z]/.test(v) || "Password must contain at least one letter.",
    hasNumber: (v) => /[0-9]/.test(v) || "Password must contain at least one number.",
  },
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

function InvalidLink({ reason }: { reason: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Link2Off size={28} strokeWidth={1.5} />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-slate-800">This link isn't valid</h1>
      <p className="mt-2 text-sm text-slate-500">{reason}</p>
      <Link
        to="/forgot-password"
        className="mt-6 inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Request a new link
      </Link>
    </div>
  );
}

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useAuth();
  const resetPassword = useResetPassword();
  const [screen, setScreen] = useState<Screen>(token ? "form" : "invalid-link");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const goToSignIn = () => {
    navigate("/");
    openLogin();
  };

  const onSubmit = async ({ password }: FormValues) => {
    if (!token) {
      setScreen("invalid-link");
      return;
    }

    setServerError("");

    try {
      await resetPassword.mutateAsync({ token, password });
      toast.success("Password updated");
      setScreen("done");
    } catch (error) {
      if (error instanceof ApiError) {
        // A 400 with no field errors means the token is unknown or expired
        if (error.status === 400 && error.fieldErrors.length === 0) {
          setScreen("invalid-link");
          return;
        }

        if (error.fieldErrors.length > 0) {
          error.fieldErrors.forEach(({ field, message }) => {
            if (field === "password") setError("password", { type: "server", message });
            else setServerError(message);
          });
          return;
        }
      }

      setServerError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      {screen === "invalid-link" && (
        <InvalidLink reason="This reset link is invalid or has expired. Reset links work once and last 15 minutes." />
      )}

      {screen === "done" && (
        <div className="rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CircleCheck size={28} strokeWidth={1.5} />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-slate-800">Password updated</h1>
          <p className="mt-2 text-sm text-slate-500">
            You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={goToSignIn}
            className="mt-6 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Sign in
          </button>
        </div>
      )}

      {screen === "form" && (
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Choose a new password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pick a strong password you haven't used before.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            <FormField
              id="password"
              label="New password"
              error={errors.password?.message}
              hint="At least 8 characters, with a letter and a number."
            >
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                autoFocus
                aria-invalid={errors.password ? true : undefined}
                className={inputClass}
                {...register("password", passwordRules)}
              />
            </FormField>

            <FormField
              id="confirm"
              label="Confirm new password"
              error={errors.confirm?.message}
            >
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                aria-invalid={errors.confirm ? true : undefined}
                className={inputClass}
                {...register("confirm", {
                  required: "Enter your new password again.",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match.",
                })}
              />
            </FormField>

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
              {isSubmitting ? "Saving..." : "Set new password"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Need a new link?{" "}
            <Link to="/forgot-password" className="font-medium text-brand hover:underline">
              Request another
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}

export default ResetPasswordPage;
