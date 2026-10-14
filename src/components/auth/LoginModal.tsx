import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BRAND_NAME } from "../../config/brand";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand";

function LoginDialog() {
  const { closeLogin, login } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup" && name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    login({
      name: mode === "signup" ? name.trim() : email.split("@")[0],
      email,
    });
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-600">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoFocus={mode === "signin"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          {mode === "signin" ? "New to " : "Already have an account? "}
          {mode === "signin" && BRAND_NAME}
          {mode === "signin" && "? "}
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