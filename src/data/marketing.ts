import {
  ShoppingBasket,
  Carrot,
  Apple,
  Citrus,
  Cherry,
  type LucideIcon,
} from "lucide-react";

// Promotional content that is not stored in the API. The images live in
// /public/images and are only used by the home page sections below.

export type TopBrand = {
  name: string;
  offer: string;
  bg: string;
  text: string;
  image: string;
};

export type DailyEssential = {
  label: string;
  icon: LucideIcon;
  offer: string;
  image: string;
};

export const topBrands: TopBrand[] = [
  {
    name: "iPhone",
    offer: "UP to 80% OFF",
    bg: "bg-slate-800",
    text: "text-white",
    image: "/images/brands/iphone.jpg",
  },
  {
    name: "realme",
    offer: "UP to 80% OFF",
    bg: "bg-amber-100",
    text: "text-slate-800",
    image: "/images/brands/realme.jpg",
  },
  {
    name: "Xiaomi",
    offer: "UP to 80% OFF",
    bg: "bg-orange-100",
    text: "text-slate-800",
    image: "/images/brands/xiaomi.png",
  },
];

export const dailyEssentials: DailyEssential[] = [
  {
    label: "Daily Essentials",
    icon: ShoppingBasket,
    offer: "UP to 50% OFF",
    image: "/images/essentials/daily-essentials.jpg",
  },
  {
    label: "Vegetables",
    icon: Carrot,
    offer: "UP to 50% OFF",
    image: "/images/essentials/vegetables.jpg",
  },
  {
    label: "Fruits",
    icon: Apple,
    offer: "UP to 50% OFF",
    image: "/images/essentials/fruits.jpg",
  },
  {
    label: "Strawberry",
    icon: Cherry,
    offer: "UP to 50% OFF",
    image: "/images/essentials/strawberry.jpg",
  },
  {
    label: "Mango",
    icon: Citrus,
    offer: "UP to 50% OFF",
    image: "/images/essentials/mango.jpg",
  },
  {
    label: "Cherry",
    icon: Cherry,
    offer: "UP to 50% OFF",
    image: "/images/essentials/cherry.jpg",
  },
];
