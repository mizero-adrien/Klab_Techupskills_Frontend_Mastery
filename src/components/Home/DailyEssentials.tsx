import { useState } from "react";
import SectionHeading from "./SectionHeading";
import ProductImage from "../ui/ProductImage";
import { dailyEssentials } from "../../data/marketing";

function DailyEssentials() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Daily" highlight="Essentials" />

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {dailyEssentials.map(({ label, icon: Icon, offer, image }, i) => {
          const isActive = i === active;

          return (
            <button
              key={`${label}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span
                className={`block h-24 w-full overflow-hidden rounded-lg border bg-slate-100 transition-colors ${
                  isActive ? "border-brand" : "border-transparent group-hover:border-brand/40"
                }`}
              >
                <ProductImage
                  src={image}
                  alt=""
                  fit="cover"
                  className="h-full w-full"
                  fallback={
                    <Icon
                      size={40}
                      strokeWidth={1.25}
                      className={isActive ? "text-brand" : "text-slate-500"}
                    />
                  }
                />
              </span>
              <span className="text-xs font-medium text-slate-700">{label}</span>
              <span className="text-[11px] font-medium text-green-600">{offer}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default DailyEssentials;