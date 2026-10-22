import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { AUTH_TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT, AUTH_USER_KEY } from "../constants/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Credentials, SignUpData, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (credentials: Credentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>(AUTH_USER_KEY, null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // A saved user only counts if we also hold a token for them
  const user = storedUser && localStorage.getItem(AUTH_TOKEN_KEY) ? storedUser : null;
  const isAdmin = user?.role === "admin";

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const login = async (credentials: Credentials) => {
    const { token, user: signedInUser } = await authService.login(credentials);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setStoredUser(signedInUser);
    setIsLoginOpen(false);
  };

  const signUp = async ({ name, email, password }: SignUpData) => {
    await authService.register({ name, email, password });
    await login({ email, password });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setStoredUser(null);
  };

  useEffect(() => {
    const onUnauthorized = () => {
      // Several requests can fail at once. The first one clears the token,
      // so the others stop here and we show only one message.
      if (!localStorage.getItem(AUTH_TOKEN_KEY)) return;

      localStorage.removeItem(AUTH_TOKEN_KEY);
      setStoredUser(null);
      toast.error("Your session expired. Please sign in again.");
      setIsLoginOpen(true);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, [setStoredUser]);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isLoginOpen, openLogin, closeLogin, login, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}