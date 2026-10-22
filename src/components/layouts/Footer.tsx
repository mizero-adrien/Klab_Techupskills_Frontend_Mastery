import { Link } from "react-router";
import { MessageCircle, Phone } from "lucide-react";
import { BRAND_NAME } from "../../config/brand";
import { CONTACT, serviceLinks } from "../../constants/site";
import { useCategories } from "../../hooks/useCategories";
import { slugify } from "../../utils/slug";

const MAX_CATEGORIES = 8;

function Footer() {
  const { data, isPending, isError } = useCategories();

  return (
    <footer className="mt-12 bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">{BRAND_NAME}</p>

          <p className="mt-5 text-xs font-semibold">Contact us</p>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 text-xs hover:underline"
          >
            <MessageCircle size={14} />
            WhatsApp {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.phoneHref}
            className="mt-2 flex items-center gap-2 text-xs hover:underline"
          >
            <Phone size={14} />
            Call us {CONTACT.phoneDisplay}
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold">Shop by category</p>

          {isPending && (
            <div className="mt-3 animate-pulse space-y-2" aria-busy="true">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-3 w-32 rounded bg-white/20" />
              ))}
            </div>
          )}

          {isError && (
            <p className="mt-3 text-xs text-white/70">Categories are unavailable right now.</p>
          )}

          {data && data.length === 0 && (
            <p className="mt-3 text-xs text-white/70">New categories are coming soon.</p>
          )}

          {data && data.length > 0 && (
            <ul className="mt-3 space-y-2 text-xs">
              {data.slice(0, MAX_CATEGORIES).map((category) => (
                <li key={category._id}>
                  <Link
                    to={`/products?category=${slugify(category.name)}`}
                    className="hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {data.length > MAX_CATEGORIES && (
                <li>
                  <Link to="/categories" className="font-medium underline">
                    View all categories
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold">Customer service</p>
          <ul className="mt-3 space-y-2 text-xs">
            {serviceLinks.map(({ label, to }) => (
              <li key={label}>
                {to ? (
                  <Link to={to} className="hover:underline">
                    {label}
                  </Link>
                ) : (
                  <span className="text-white/70">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-[11px]">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;