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
  popular: ["Staples", "Beverages", "Personal Care", "Home Care", "Baby Care", "Vegetables & Fruits", "Snacks & Foods", "Dairy & Bakery"],
  service: ["About Us", "Terms & Conditions", "FAQ", "Privacy Policy", "E-waste Policy", "Cancellation & Return Policy"],
};