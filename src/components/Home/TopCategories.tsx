import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { topCategories } from "../../data/Home";

function TopCategories() {
  const [active, setActive] = useState(0);

  return (
    <>
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Shop From" highlight="Top Categories" />

      <div className="flex gap-6 overflow-x-auto pb-2 sm:justify-between">
        {topCategories.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 transition ${
                i === active
                  ? "text-brand ring-2 ring-brand ring-offset-2"
                  : "text-slate-500 hover:text-brand"
              }`}
            >
              <Icon size={32} strokeWidth={1.25} />
            </span>
            <span className="text-xs text-slate-600">{label}</span>
          </button>
        ))}
      </div>
    </section>
    </>
  );
}

export default TopCategories;

