import api from "./api";
import type { AuthResponse, Credentials, SignUpData, User } from "../types/auth";

export const authService = {
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Your server returns the new user but no token, so the caller signs in afterwards
  register: async (data: SignUpData): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },
};