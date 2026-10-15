import {
  Smartphone, Sparkles, Tv, Armchair, Watch, Flower2, Gem,
  ShoppingBasket, Carrot, Apple, Citrus, Cherry,
  type LucideIcon,
} from "lucide-react";


export const heroSlides = [
  { id: 1, eyebrow: "Best Deal Online on smart watches", title: "SMART WEARABLE.", subtitle: "UP to 80% OFF" },
  { id: 2, eyebrow: "New arrivals in mobiles", title: "LATEST SMARTPHONES.", subtitle: "UP to 60% OFF" },
  { id: 3, eyebrow: "Fresh every morning", title: "DAILY ESSENTIALS.", subtitle: "UP to 50% OFF" },
  { id: 4, eyebrow: "Make your home yours", title: "HOME & DECOR.", subtitle: "UP to 40% OFF" },
  { id: 5, eyebrow: "Sound that moves you", title: "AUDIO SALE.", subtitle: "UP to 70% OFF" },
  { id: 6, eyebrow: "Style for every season", title: "FASHION FINDS.", subtitle: "UP to 55% OFF" },
  { id: 7, eyebrow: "Work smarter", title: "LAPTOP DEALS.", subtitle: "UP to 35% OFF" },
];

export type Deal = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  image?: string;
};


export const smartphoneDeals: Deal[] = [
  { id: 1, name: "Galaxy S22 Ultra", price: 32999, oldPrice: 74999 },
  { id: 2, name: "Galaxy M13 (4GB | 64 GB)", price: 10499, oldPrice: 14999 },
  { id: 3, name: "Galaxy M33 (4GB | 64 GB)", price: 16999, oldPrice: 24999 },
  { id: 4, name: "Galaxy M53 (4GB | 64 GB)", price: 31999, oldPrice: 40999 },
  { id: 5, name: "Galaxy S22 Ultra", price: 67999, oldPrice: 85999 },
];
export type IconItem = { label: string; icon: LucideIcon };


export type CategoryItem = {
  label: string;
  icon: LucideIcon;
};

export const topCategories: CategoryItem[] = [
  { label: "Mobile", icon: Smartphone },
  { label: "Cosmetics", icon: Sparkles },
  { label: "Electronics", icon: Tv },
  { label: "Furniture", icon: Armchair },
  { label: "Watches", icon: Watch },
  { label: "Decor", icon: Flower2 },
  { label: "Accessories", icon: Gem },
];

export const topBrands = [
  { name: "iPhone", offer: "UP to 80% OFF", bg: "bg-slate-800", text: "text-white" },
  { name: "realme", offer: "UP to 80% OFF", bg: "bg-amber-100", text: "text-slate-800" },
  { name: "Xiaomi", offer: "UP to 80% OFF", bg: "bg-orange-100", text: "text-slate-800" },
];

export const dailyEssentials = [
  { label: "Daily Essentials", icon: ShoppingBasket, offer: "UP to 50% OFF" },
  { label: "Vegetables", icon: Carrot, offer: "UP to 50% OFF" },
  { label: "Fruits", icon: Apple, offer: "UP to 50% OFF" },
  { label: "Strawberry", icon: Cherry, offer: "UP to 50% OFF" },
  { label: "Mango", icon: Citrus, offer: "UP to 50% OFF" },
  { label: "Cherry", icon: Cherry, offer: "UP to 50% OFF" },
];

export const footerLinks = {
  popular: [
    "Staples",
    "Beverages",
    "Personal Care",
    "Home Care",
    "Baby Care",
    "Vegetables & Fruits",
    "Snacks & Foods",
    "Dairy & Bakery",
  ],
  service: [
    "About Us",
    "Terms & Conditions",
    "FAQ",
    "Privacy Policy",
    "E-waste Policy",
    "Cancellation & Return Policy",
  ],
};

export type Product = Deal & { category: string };

export const products: Product[] = [
  { id: 1, name: "Galaxy S22 Ultra", price: 32999, oldPrice: 74999, category: "mobile", image: "/images/products/samsung-galaxy-s22-5g.jpg" },
  { id: 2, name: "Galaxy M13 (4GB | 64 GB)", price: 10499, oldPrice: 14999, category: "mobile", image: "/images/products/samsung-galaxy-m13.jpg" },
  { id: 3, name: "Galaxy M33 (4GB | 64 GB)", price: 16999, oldPrice: 24999, category: "mobile", image: "/images/products/samsung-galaxy-m33.jpg" },
  { id: 4, name: "Smart Watch Pro", price: 4999, oldPrice: 9999, category: "watches", image: "/images/products/itel-smart-watch-1.jpg" },
  { id: 5, name: "Fitness Band 5", price: 1999, oldPrice: 3999, category: "watches" },
  { id: 6, name: "Smart TV 43 inch", price: 24999, oldPrice: 34999, category: "electronics" },
  { id: 7, name: "Bluetooth Speaker", price: 1499, oldPrice: 2999, category: "electronics" },
  { id: 8, name: "Wooden Armchair", price: 8999, oldPrice: 12999, category: "furniture" },
    { id: 9, name: "Fresh Vegetable Basket", price: 1200, oldPrice: 1800, category: "groceries" },
  { id: 10, name: "Mango Box (1kg)", price: 900, oldPrice: 1400, category: "fruits" },
  { id: 11, name: "Strawberry Pack", price: 1100, oldPrice: 1600, category: "fruits" },
  { id: 12, name: "Non-stick Pan Set", price: 6500, oldPrice: 9500, category: "kitchen" },
  { id: 13, name: "Cotton T-Shirt", price: 2500, oldPrice: 4000, category: "fashion" },
  { id: 14, name: "Face Moisturizer", price: 3200, oldPrice: 4500, category: "beauty" },
  { id: 15, name: "Cordless Drill", price: 18000, oldPrice: 25000, category: "improvement" },
  { id: 16, name: "Football", price: 2800, oldPrice: 4200, category: "sports" },
];

export const navCategories = [
  {
    label: "Groceries",
    slug: "groceries",
    children: [{ label: "Vegetables", term: "vegetable" }],
  },
  {
    label: "Premium Fruits",
    slug: "fruits",
    children: [
      { label: "Mango", term: "mango" },
      { label: "Strawberry", term: "strawberry" },
    ],
  },
  {
    label: "Home & Kitchen",
    slug: "kitchen",
    children: [{ label: "Pans & Cookware", term: "pan" }],
  },
  {
    label: "Fashion",
    slug: "fashion",
    children: [{ label: "T-Shirts", term: "shirt" }],
  },
  {
    label: "Electronics",
    slug: "electronics",
    children: [
      { label: "Televisions", term: "tv" },
      { label: "Speakers", term: "speaker" },
    ],
  },
  {
    label: "Beauty",
    slug: "beauty",
    children: [{ label: "Moisturizers", term: "moisturizer" }],
  },
  {
    label: "Home Improvement",
    slug: "improvement",
    children: [{ label: "Drills", term: "drill" }],
  },
  {
    label: "Sports, Toys & Luggage",
    slug: "sports",
    children: [{ label: "Football", term: "football" }],
  },
];