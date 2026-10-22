import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError } from "../services/api";

const isClientError = (error: unknown) =>
  error instanceof ApiError && error.status >= 400 && error.status < 500;

const FORBIDDEN_MESSAGE = "You don't have permission to do that.";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 401 is handled by the auth interceptor (session expired popup)
      if (error instanceof ApiError && error.status === 401) return;

      if (error instanceof ApiError && error.status === 403) {
        toast.error(FORBIDDEN_MESSAGE, { id: "forbidden" });
        return;
      }

      // A first-load failure is shown by the screen's own error box.
      // A failed background refresh has no screen of its own, so we tell the user here.
      if (query.state.data !== undefined) {
        toast.error("Could not refresh the latest data.", { id: "refresh-failed" });
      }
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      // Forms and delete buttons already report their own errors.
      // Permission problems are the one case worth saying everywhere, the same way.
      if (error instanceof ApiError && error.status === 403) {
        toast.error(FORBIDDEN_MESSAGE, { id: "forbidden" });
      }
    },
  }),

  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
    },
  },
});