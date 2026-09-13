export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function avgRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function ratingPercent(reviews: { rating: number }[], star: number): number {
  if (!reviews.length) return 0;
  const count = reviews.filter((r) => r.rating === star).length;
  return Math.round((count / reviews.length) * 100);
}