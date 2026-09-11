import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProductImage } from "@/components/ui/ProductImage";
import { Stars } from "@/components/ui/Stars";
import { formatPrice } from "@/lib/price";
import type { ProductWithCategory } from "@/lib/schema";

export function FeaturedBadge() {
  return (
    <span className="absolute left-sm top-sm z-10 badge-tag">
      Featured
    </span>
  );
}

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <Card
      hover
      className="group flex h-full flex-col overflow-hidden p-0"
    >
      <Link
        href={`/store/${product.slug}`}
        className="relative block aspect-square w-full"
      >
        {product.is_featured && <FeaturedBadge />}
        <ProductImage src={product.image_url} alt={product.name} className="aspect-square w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-xs p-lg pt-sm">
        {product.category_name && (
          <span className="text-label-sm uppercase tracking-[0.08em] text-on-surface-variant">
            {product.category_name}
          </span>
        )}
        <h3 className="font-display text-headline-sm text-on-surface">
          <Link href={`/store/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-body-sm text-on-surface-variant">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-sm">
          <span className="text-title-lg text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-body-sm font-semibold text-tertiary-container">
            COD available
          </span>
        </div>
      </div>
    </Card>
  );
}

export function ReviewSummary({
  average,
  count,
}: {
  average: number;
  count: number;
}) {
  if (!count) {
    return <span className="text-body-sm text-on-surface-variant">No reviews yet</span>;
  }
  return (
    <span className="flex items-center gap-xs">
      <Stars rating={average} />
      <span className="text-body-sm text-on-surface-variant">
        {average.toFixed(1)} · {count} {count === 1 ? "review" : "reviews"}
      </span>
    </span>
  );
}