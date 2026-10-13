import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  highlight: string;
  to?: string;
};

function SectionHeading({ title, highlight, to = "/products" }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-slate-100">
      <h2 className="-mb-px border-b-2 border-brand pb-2 text-lg font-medium text-slate-600">
        {title} <span className="text-brand">{highlight}</span>
      </h2>
      <Link
        to={to}
        className="flex items-center gap-1 pb-2 text-xs font-medium text-slate-700 hover:text-brand"
      >
        View All <ChevronRight size={14} />
      </Link>
    </div>
  );
}

export default SectionHeading;