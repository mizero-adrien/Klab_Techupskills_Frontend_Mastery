export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category | string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};