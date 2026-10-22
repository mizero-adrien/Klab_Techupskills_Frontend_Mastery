import api from "./api";
import type { Category } from "../types/product";

export const categoryService = {
  getCategories: async (signal?: AbortSignal): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories", { signal });
    return response.data;
  },

  getCategory: async (id: string, signal?: AbortSignal): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`, { signal });
    return response.data;
  },

  // Create and update send FormData because the routes use multer for the image.
  // We deliberately set no Content-Type: the browser adds it, with the multipart boundary.
  createCategory: async (body: FormData): Promise<Category> => {
    const response = await api.post<Category>("/categories", body);
    return response.data;
  },

  updateCategory: async (id: string, body: FormData): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, body);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};