import { Link } from "react-router";
import toast from "react-hot-toast";
import type { Product } from "../../lib/toProducts";
import { useCart } from "../../context/CartContext";
import { money } from "../../utils/money";
import ProductImage from "../ui/ProductImage";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const href = `/products/${product.id}`;
  const outOfStock = product.stock <= 0;

  const hasDiscount = product.oldPrice !== undefined && product.oldPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="overflow-hidden rounded-lg bg-white">
      <Link
        to={href}
        aria-label={`View ${product.name}`}
        className="relative flex h-40 items-center justify-center bg-slate-100"
      >
        {hasDiscount && (
          <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-brand px-2 py-1 text-center text-[10px] font-semibold leading-tight text-white">
            {discount}%
            <br />
            OFF
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 z-10 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-white">
            Sold out
          </span>
        )}
        <ProductImage src={product.image} alt="" className="h-32 w-full p-3" />
      </Link>

      <div className="space-y-1 p-3 text-xs">
        <p className="text-[11px] capitalize text-slate-500">{product.categoryName}</p>
        <h3 className="font-medium text-slate-800">
          <Link to={href} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="font-semibold text-slate-900">
          {money(product.price)}
          {hasDiscount && (
            <s className="ml-2 font-normal text-slate-500">{money(product.oldPrice!)}</s>
          )}
        </p>
        {hasDiscount && (
          <p className="border-t border-slate-100 pt-2 font-medium text-green-600">
            Save - {money(product.oldPrice! - product.price)}
          </p>
        )}

        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAdd}
          className="mt-2 w-full rounded-md bg-brand py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;



