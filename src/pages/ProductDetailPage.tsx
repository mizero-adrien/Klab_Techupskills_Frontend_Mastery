import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Minus, Plus } from "lucide-react";
import { products, type Product } from "../data/Home";
import { useCart } from "../context/CartContext";
import { money } from "../utils/money";
import ProductImage from "../components/ui/ProductsImage";
import ProductCard from "../components/Home/ProductCard";

function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const saved = product.oldPrice - product.price;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand">Home</Link>
        {" / "}
        <Link to="/products" className="hover:text-brand">Products</Link>
        {" / "}
        <Link
          to={`/products?category=${product.category}`}
          className="capitalize hover:text-brand"
        >
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative flex items-center justify-center rounded-xl bg-slate-100">
          <span className="absolute right-0 top-0 z-10 rounded-bl-lg rounded-tr-xl bg-brand px-3 py-1.5 text-center text-xs font-semibold leading-tight text-white">
            {discount}%
            <br />
            OFF
          </span>
          <ProductImage
            src={product.image}
            alt={product.name}
            iconSize={72}
            className="h-72 w-full p-6 md:h-96"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{product.name}</h1>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {money(product.price)}{" "}
            <s className="ml-2 text-base font-normal text-slate-500">{money(product.oldPrice)}</s>
          </p>
          <p className="mt-1 text-sm font-medium text-green-600">You save {money(saved)}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-slate-600">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity === 1}
                onClick={() => setQuantity((q) => q - 1)}
                className="rounded-full border border-slate-200 p-1.5 text-slate-600 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded-full border border-slate-200 p-1.5 text-slate-600 hover:border-brand hover:text-brand"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 w-full rounded-md bg-brand py-3 text-sm font-medium text-white hover:opacity-90 sm:w-auto sm:px-10"
          >
            {added ? "Added to cart ✓" : `Add to cart · ${money(product.price * quantity)}`}
          </button>

          {added && (
            <p role="status" className="mt-3 text-sm text-slate-600">
              In your cart.{" "}
              <Link to="/cart" className="font-medium text-brand hover:underline">
                View cart
              </Link>
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} deal={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Product not found</h1>
        <p className="mt-2 text-sm text-slate-500">It may have been removed or the link is wrong.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-5 py-2 text-sm font-medium text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}

export default ProductDetailPage;