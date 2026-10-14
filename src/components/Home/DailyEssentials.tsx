import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { dailyEssentials } from "../../data/Home";

function DailyEssentials() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Daily" highlight="Essentials" />

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {dailyEssentials.map(({ label, icon: Icon, offer }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-24 w-full items-center justify-center rounded-lg border bg-slate-100 ${
                i === active
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500"
              }`}
            >
              <Icon size={40} strokeWidth={1.25} />
            </span>
            <span className="text-xs font-medium text-slate-700">{label}</span>
            <span className="text-[11px] font-medium text-green-600">{offer}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default DailyEssentials;