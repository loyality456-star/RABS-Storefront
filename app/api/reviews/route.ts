import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, query, queryOne } from "@/lib/db";
import { ensureSchema, newId } from "@/lib/products";
import type { Review } from "@/lib/schema";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  product_id: z.string().min(1),
  customer_name: z.string().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(2000),
});

export async function GET(req: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");
    if (!productId) {
      return NextResponse.json({ error: "product_id is required." }, { status: 400 });
    }
    const reviews = await query<Review>(
      "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
      [productId]
    );
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET /api/reviews", err);
    return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = reviewSchema.parse(await req.json());

    const product = await queryOne<{ id: string }>(
      "SELECT id FROM products WHERE id = ? AND is_active = 1",
      [body.product_id]
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const id = newId();
    await execute(
      `INSERT INTO reviews (id, product_id, customer_name, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [id, body.product_id, body.customer_name, body.rating, body.comment]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    console.error("POST /api/reviews", err);
    return NextResponse.json({ error: "Could not save review." }, { status: 500 });
  }
}