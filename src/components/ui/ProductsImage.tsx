import { useState } from "react";
import { ImageOff } from "lucide-react";

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: number;
};

function ProductImage({ src, alt, className = "", iconSize = 40 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center text-slate-300 ${className}`}>
        <ImageOff size={iconSize} strokeWidth={1} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-contain mix-blend-multiply ${className}`}
    />
  );
}

export default ProductImage;