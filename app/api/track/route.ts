import { NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { ensureSchema } from "@/lib/products";
import type { Order, OrderItem } from "@/lib/schema";

export const dynamic = "force-dynamic";

const schema = z.object({ id: z.string().trim().min(1).max(64) });

export async function POST(req: Request) {
  try {
    const { id } = schema.parse(await req.json());
    await ensureSchema();

    const order = await queryOne<Order>("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    if (!order) {
      return NextResponse.json(
        { error: "No order found with that number. Double-check and try again." },
        { status: 404 }
      );
    }

    const items = await query<OrderItem>(
      "SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid ASC",
      [id]
    );

    return NextResponse.json({
      order: {
        id: order.id,
        customer_name: order.customer_name,
        status: order.status,
        payment_method: order.payment_method,
        total: Number(order.total),
        city: order.city,
        phone: order.phone,
        created_at: order.created_at,
      },
      items,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Enter a valid order number." },
        { status: 400 }
      );
    }
    console.error("POST /api/track", err);
    return NextResponse.json(
      { error: "Tracking failed. Please try again." },
      { status: 500 }
    );
  }
}