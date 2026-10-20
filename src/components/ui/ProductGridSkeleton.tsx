type Props = { count?: number; className?: string };

function ProductGridSkeleton({
  count = 8,
  className = "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
}: Props) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-lg bg-white">
          <div className="h-40 bg-slate-100" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-8 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;