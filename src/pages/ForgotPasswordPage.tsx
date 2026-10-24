import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";
import { useForgotPassword } from "../hooks/useAuthMutations";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";
import FormField from "../components/ui/FormField";

type FormValues = { email: string };

const emailRules = {
  required: "Enter your email address.",
  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
};

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-[invalid=true]:border-red-400";

const RESEND_SECONDS = 60;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { openLogin } = useAuth();
  const forgotPassword = useForgotPassword();
  const [sentTo, setSentTo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = window.setInterval(() => {
      setCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [cooldown]);

  const send = async (email: string) => {
    setServerError("");
    try {
      await forgotPassword.mutateAsync(email);
      setSentTo(email);
      setCooldown(RESEND_SECONDS);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        error.fieldErrors.forEach(({ field, message }) => {
          if (field === "email") setError("email", { type: "server", message });
          else setServerError(message);
        });
        return;
      }
      setServerError(error instanceof Error ? error.message : "Something went wrong");
      throw error;
    }
  };

  const onSubmit = async ({ email }: FormValues) => {
    await send(email.trim()).catch(() => undefined);
  };

  const resend = async () => {
    await send(getValues("email").trim()).catch(() => undefined);
  };

  const goToSignIn = () => {
    navigate("/");
    openLogin();
  };

  if (sentTo) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
            <MailCheck size={28} strokeWidth={1.5} />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-slate-800">Check your inbox</h1>
          <p className="mt-2 text-sm text-slate-500">
            If an account exists for <span className="font-medium text-slate-700">{sentTo}</span>,
            we've sent a link to reset your password. The link expires in 15 minutes.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Didn't get it? Check your spam folder before requesting another link.
          </p>

          {serverError && (
            <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="button"
            disabled={cooldown > 0 || forgotPassword.isPending}
            onClick={resend}
            className="mt-6 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : forgotPassword.isPending
                ? "Sending..."
                : "Resend email"}
          </button>

          <button
            type="button"
            onClick={goToSignIn}
            className="mt-3 text-xs font-medium text-brand hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the email you signed up with and we'll send you a link to choose a new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              aria-invalid={errors.email ? true : undefined}
              className={inputClass}
              {...register("email", emailRules)}
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
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Remembered it?{" "}
          <button
            type="button"
            onClick={goToSignIn}
            className="font-medium text-brand hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
