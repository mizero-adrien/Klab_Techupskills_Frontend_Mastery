import type { ApiProduct } from "../types/product";
import { slugify } from "../utils/slug";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
};

export function toProduct(p: ApiProduct): Product {
  const category = p.category && typeof p.category === "object" ? p.category : null;
  const categoryName = category?.name ?? "Uncategorized";

  return {
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    image: p.imageUrl,
    categoryId: category?._id ?? (typeof p.category === "string" ? p.category : ""),
    categoryName,
    categorySlug: slugify(categoryName),
  };
}