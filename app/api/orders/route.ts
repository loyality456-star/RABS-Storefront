import { NextResponse } from "next/server";
import { z } from "zod";
import { execute } from "@/lib/db";
import { ensureSchema, newId } from "@/lib/products";

export const dynamic = "force-dynamic";

const orderItemSchema = z.object({
  product_id: z.string().min(1),
  product_name: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  unit_price: z.number().min(0),
});

const orderSchema = z.object({
  customer_name: z.string().min(1).max(80),
  phone: z.string().min(4).max(30),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  address: z.string().min(5).max(500),
  city: z.string().min(1).max(80),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(orderItemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = orderSchema.parse(await req.json());

    const total = body.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    const orderId = newId();
    const customer = {
      customer_name: body.customer_name,
      phone: body.phone,
      email: (body.email as string | null | undefined) || null,
      address: body.address,
      city: body.city,
      notes: (body.notes as string | null | undefined) || null,
    };

    await execute(
      `INSERT INTO orders (id, customer_name, phone, email, address, city, notes, payment_method, status, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'cod', 'pending', ?)`,
      [
        orderId,
        customer.customer_name,
        customer.phone,
        customer.email,
        customer.address,
        customer.city,
        customer.notes,
        total,
      ]
    );

    for (const item of body.items) {
      const itemId = newId();
      await execute(
        `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
        ]
      );
    }

    return NextResponse.json({ id: orderId }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    console.error("POST /api/orders", err);
    return NextResponse.json({ error: "Could not place the order." }, { status: 500 });
  }
}