import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { LeafDivider } from "@/components/Leaf";
import { ReviewForm } from "@/components/ReviewForm";
import { ProductImage } from "@/components/ui/ProductImage";
import { Stars } from "@/components/ui/Stars";
import { ensureSchema, getProductBySlug, listReviews } from "@/lib/products";
import { avgRating, formatPrice, ratingPercent } from "@/lib/price";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureSchema();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await listReviews(product.id);
  const average = avgRating(reviews);

  return (
    <>
      <div className="container-site py-3xl">
        <div className="grid gap-xl lg:grid-cols-2">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full rounded-lg border border-outline-variant"
            priority
          />

          <div className="flex flex-col gap-md">
            <div className="flex flex-wrap items-center gap-sm">
              {product.category_name && (
                <span className="badge-tag">{product.category_name}</span>
              )}
              {product.is_featured && <span className="badge-tag">Featured</span>}
            </div>

            <h1 className="font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              {product.name}
            </h1>

            <div className="flex items-center gap-sm">
              <Stars rating={average} />
              <span className="text-body-sm text-on-surface-variant">
                {reviews.length > 0
                  ? `${average.toFixed(1)} · ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                  : "No reviews yet"}
              </span>
            </div>

            <p className="font-display text-display-lg-mobile text-primary">
              {formatPrice(product.price)}
            </p>

            <div className="rounded-[0.5rem] border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
              Cash on Delivery — pay only when your order reaches your door.
            </div>

            <p className="whitespace-pre-line text-body-lg text-on-surface-variant">
              {product.description}
            </p>

            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
            />
          </div>
        </div>
      </div>

      <LeafDivider />

      <section className="container-site py-3xl">
        <div className="grid gap-xl lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Customer reviews
            </h2>

            {reviews.length > 0 && (
              <div className="mt-md grid gap-md sm:grid-cols-2">
                <div className="card flex items-center gap-md">
                  <span className="font-display text-display-lg text-primary">
                    {average.toFixed(1)}
                  </span>
                  <div>
                    <Stars rating={average} />
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                      Based on {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
                <div className="card space-y-xs">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-sm">
                      <span className="w-3 text-body-sm text-on-surface-variant">{star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${ratingPercent(reviews, star)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-body-sm text-on-surface-variant">
                        {ratingPercent(reviews, star)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-xl space-y-md">
              {reviews.length === 0 && (
                <p className="text-body-md text-on-surface-variant">
                  No reviews yet — be the first to share your experience.
                </p>
              )}
              {reviews.map((review) => (
                <article key={review.id} className="card space-y-xs">
                  <div className="flex items-center justify-between gap-sm">
                    <span className="text-title-md text-on-surface">
                      {review.customer_name}
                    </span>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="text-body-md text-on-surface-variant">
                    {review.comment}
                  </p>
                  {review.reply && (
                    <div className="mt-sm rounded-[0.5rem] border-l-2 border-secondary bg-surface-container-low px-md py-sm">
                      <p className="text-label-md uppercase tracking-[0.06em] text-secondary">
                        Response from RABS
                      </p>
                      <p className="mt-xs text-body-md text-on-surface-variant">
                        {review.reply}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </section>
    </>
  );
}