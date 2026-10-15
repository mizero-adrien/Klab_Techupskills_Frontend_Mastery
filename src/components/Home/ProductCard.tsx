import { Link } from "react-router";
import type { Deal } from "../../data/Home";
import { useCart } from "../../context/CartContext";
import { money } from "../../utils/money";
import ProductImage from "../ui/ProductsImage";

function ProductCard({ deal }: { deal: Deal }) {
  const { addToCart } = useCart();
  const discount = Math.round(((deal.oldPrice - deal.price) / deal.oldPrice) * 100);
  const saved = deal.oldPrice - deal.price;
  const href = `/products/${deal.id}`;

  return (
    <article className="overflow-hidden rounded-lg bg-white">
      <Link
        to={href}
        aria-label={`View ${deal.name}`}
        className="relative flex h-40 items-center justify-center bg-slate-100"
      >
        <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-brand px-2 py-1 text-center text-[10px] font-semibold leading-tight text-white">
          {discount}%
          <br />
          OFF
        </span>
        <ProductImage src={deal.image} alt="" className="h-32 w-full p-3" />
      </Link>

      <div className="space-y-1 p-3 text-xs">
        <h3 className="font-medium text-slate-800">
          <Link to={href} className="hover:text-brand">
            {deal.name}
          </Link>
        </h3>
        <p className="font-semibold text-slate-900">
          {money(deal.price)}{" "}
          <s className="ml-1 font-normal text-slate-500">{money(deal.oldPrice)}</s>
        </p>
        <p className="border-t border-slate-100 pt-2 font-medium text-green-600">
          Save - {money(saved)}
        </p>

        <button
          type="button"
          onClick={() => addToCart(deal)}
          className="mt-2 w-full rounded-md bg-brand py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;



