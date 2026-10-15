import { Link } from "react-router";
import SectionHeading from "./SectionHeading";
import ProductImage from "../ui/ProductsImage";
import { topCategories } from "../../data/Home";

function TopCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Shop From" highlight="Top Categories" />

      <div className="flex gap-6 overflow-x-auto p-2 sm:justify-between">
        {topCategories.map(({ label, icon: Icon, image }) => (
          <Link
            key={label}
            to={`/products?category=${label.toLowerCase()}`}
            className="group flex shrink-0 flex-col items-center gap-2"
          >
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition group-hover:ring-2 group-hover:ring-brand group-hover:ring-offset-2">
              <ProductImage
                src={image}
                alt=""
                fit="cover"
                className="h-full w-full"
                fallback={
                  <Icon
                    size={32}
                    strokeWidth={1.25}
                    className="text-slate-500 transition group-hover:text-brand"
                  />
                }
              />
            </span>
            <span className="text-xs text-slate-600 group-hover:text-brand">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TopCategories;
