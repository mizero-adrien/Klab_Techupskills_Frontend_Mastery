import { Link } from "react-router";
import { MessageCircle, Phone } from "lucide-react";
import { BRAND_NAME } from "../../config/brand";
import { footerLinks } from "../../data/Home";

function Footer() {
  return (
    <footer className="mt-12 bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">{BRAND_NAME}</p>

          <p className="mt-5 text-xs font-semibold">Contact Us</p>
          <p className="mt-2 flex items-center gap-2 text-xs">
            <MessageCircle size={14} /> WhatsApp +250 700 000 000
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs">
            <Phone size={14} /> Call Us +250 700 000 000
          </p>

          <p className="mt-5 text-xs font-semibold">Download App</p>
          <div className="mt-2 flex gap-2">
            <a href="#" className="rounded-md bg-black px-3 py-1.5 text-[11px]">
              App Store
            </a>
            <a href="#" className="rounded-md bg-black px-3 py-1.5 text-[11px]">
              Google Play
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Most Popular Categories</p>
          <ul className="mt-3 space-y-2 text-xs">
            {footerLinks.popular.map((item) => (
              <li key={item}>
                <Link to="/products" className="hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Customer Services</p>
          <ul className="mt-3 space-y-2 text-xs">
            {footerLinks.service.map((item) => (
              <li key={item}>
                <a href="#" className="hover:underline">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-[11px]">
        © {new Date().getFullYear()}. All rights reserved. {BRAND_NAME}
      </div>
    </footer>
  );
}

export default Footer;