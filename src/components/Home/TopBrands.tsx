import { Link } from "react-router";
import { Smartphone } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { topBrands } from "../../data/Home";

function TopBrands() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Top" highlight="Electronics Brands" />

      <div className="grid gap-4 md:grid-cols-3">
        {topBrands.map((brand) => (
          <Link
            key={brand.name}
            to="/products"
            className={`flex items-center justify-between rounded-xl p-5 ${brand.bg} ${brand.text}`}
          >
            <div>
              <p className="text-sm font-semibold">{brand.name}</p>
              <p className="mt-6 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-800">
                {brand.offer}
              </p>
            </div>
            <Smartphone size={72} strokeWidth={1} className="opacity-70" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TopBrands;