import { useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: number;
  fit?: "contain" | "cover";
  fallback?: ReactNode;
};

function ProductImage({
  src,
  alt,
  className = "",
  iconSize = 40,
  fit = "contain",
  fallback,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center text-slate-300 ${className}`}>
        {fallback ?? <ImageOff size={iconSize} strokeWidth={1} aria-hidden="true" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${
        fit === "cover" ? "object-cover" : "object-contain mix-blend-multiply"
      } ${className}`}
    />
  );
}

export default ProductImage;