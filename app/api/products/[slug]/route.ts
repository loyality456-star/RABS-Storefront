import { NextResponse } from "next/server";
import { ensureSchema, getProductBySlug, listReviews } from "@/lib/products";
import { avgRating } from "@/lib/price";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureSchema();
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    const reviews = await listReviews(product.id);
    return NextResponse.json({
      product,
      reviews,
      average_rating: avgRating(reviews),
      review_count: reviews.length,
    });
  } catch (err) {
    console.error("GET /api/products/[slug]", err);
    return NextResponse.json(
      { error: "Could not load product." },
      { status: 500 }
    );
  }
}