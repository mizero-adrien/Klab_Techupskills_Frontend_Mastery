import ProductCard from "../components/Home/ProductCard";
import { products } from "../data/Home";

function ProductsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-5 text-2xl font-semibold text-slate-800">All products</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} deal={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsPage;