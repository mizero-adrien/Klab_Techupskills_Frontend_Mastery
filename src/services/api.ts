import axios, { AxiosError } from "axios";
import { AUTH_TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT } from "../constants/auth";

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldError[];

  constructor(message: string, status = 0, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ErrorBody = { message?: unknown; errors?: unknown };

const isFieldError = (value: unknown): value is FieldError =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as FieldError).field === "string" &&
  typeof (value as FieldError).message === "string";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:1000/api").replace(/\/$/, ""),
  timeout: 60_000,
});

// Runs before every request: attach the login token if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Runs on every response: turn every failure into one predictable ApiError
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // A request cancelled on purpose (TanStack Query does this) is not a failure
    if (axios.isCancel(error)) return Promise.reject(error);

    if (!axios.isAxiosError(error)) {
      return Promise.reject(error instanceof Error ? error : new ApiError("Something went wrong"));
    }

    const axiosError: AxiosError<ErrorBody> = error;

    // No response at all: network down, server asleep, or timeout
    if (!axiosError.response) {
      const timedOut = axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT";
      return Promise.reject(
        new ApiError(
          timedOut
            ? "The server took too long to respond. Please try again."
            : "Cannot reach the server. Check your connection and try again."
        )
      );
    }

    const { status, data } = axiosError.response;

    // A signed-in user whose token was rejected: tell the app to sign them out.
    // Wrong passwords on /auth routes are also 401, so those are excluded.
    const hadToken = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
    const isAuthRoute = axiosError.config?.url?.startsWith("/auth/") ?? false;
    if (status === 401 && hadToken && !isAuthRoute) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    const fieldErrors = Array.isArray(data?.errors) ? data.errors.filter(isFieldError) : [];
    const message =
      fieldErrors[0]?.message ??
      (typeof data?.message === "string" ? data.message : `Request failed (${status})`);

    return Promise.reject(new ApiError(message, status, fieldErrors));
  }
);

export default api;