export const CONTACT = {
  phoneDisplay: "+250 700 000 000",
  phoneHref: "tel:+250700000000",
  whatsappHref: "https://wa.me/250700000000",
};

export type ServiceLink = {
  label: string;
  to?: string;
};

// Links with a "to" go to real pages. The others are shown as plain text
// until those pages exist.
export const serviceLinks: ServiceLink[] = [
  { label: "My account", to: "/account" },
  { label: "My cart", to: "/cart" },
  { label: "All categories", to: "/categories" },
  { label: "About us" },
  { label: "Terms & conditions" },
  { label: "FAQ" },
  { label: "Privacy policy" },
  { label: "Cancellation & return policy" },
];
