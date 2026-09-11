import { NextResponse } from "next/server";
import { ensureSchema, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const products = await listProducts(true);
    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products", err);
    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 }
    );
  }
}