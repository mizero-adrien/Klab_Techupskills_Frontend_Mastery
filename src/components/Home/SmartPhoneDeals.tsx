import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "../ui/ProductGridSkeleton";
import { useProducts } from "../../hooks/useProducts";

const GRID = "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5";

function SmartphoneDeals() {
  const { data, isPending, isError } = useProducts();
  const featured = (data ?? []).slice(0, 5);

  if (isError || (!isPending && featured.length === 0)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading title="Our latest" highlight="Products" />
      {isPending ? (
        <ProductGridSkeleton count={5} className={GRID} />
      ) : (
        <div className={GRID}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default SmartphoneDeals;