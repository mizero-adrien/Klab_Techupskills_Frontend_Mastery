import api from "./api";
import type { ApiProduct } from "../types/product";

export const productService = {
  getProducts: async (signal?: AbortSignal): Promise<ApiProduct[]> => {
    const response = await api.get<ApiProduct[]>("/products", { signal });
    return response.data;
  },

  getProduct: async (id: string, signal?: AbortSignal): Promise<ApiProduct> => {
    const response = await api.get<ApiProduct>(`/products/${id}`, { signal });
    return response.data;
  },

  // Create and update send FormData because your routes use multer for the image.
  // We deliberately set no Content-Type: the browser adds it, with the multipart boundary.
  createProduct: async (body: FormData): Promise<ApiProduct> => {
    const response = await api.post<ApiProduct>("/products", body);
    return response.data;
  },

  updateProduct: async (id: string, body: FormData): Promise<ApiProduct> => {
    const response = await api.put<ApiProduct>(`/products/${id}`, body);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};