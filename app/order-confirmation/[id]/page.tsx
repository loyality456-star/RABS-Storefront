import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { query, queryOne } from "@/lib/db";
import { ensureSchema } from "@/lib/products";
import { formatPrice } from "@/lib/price";
import type { Order, OrderItem } from "@/lib/schema";

export const metadata: Metadata = { title: "Order confirmed" };

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureSchema();

  const order = await queryOne<Order>("SELECT * FROM orders WHERE id = ?", [id]);
  if (!order) notFound();

  const itemsList = await query<OrderItem>(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    [id]
  );

  const formatted = new Date(order.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="container-site py-3xl">
      <div className="mx-auto max-w-2xl">
        <div className="card space-y-lg bg-gradient-to-br from-surface-container-low to-surface p-xl">
          <div>
            <span className="eyebrow">Order received</span>
            <h1 className="mt-xs font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Thank you, {order.customer_name}!
            </h1>
            <p className="mt-sm text-body-md text-on-surface-variant">
              Order <span className="font-semibold text-primary">#{order.id}</span>{" "}
              placed on {formatted}. Our team will call{" "}
              <span className="font-semibold">{order.phone}</span> to confirm.
            </p>
          </div>

          <div className="rounded-[0.5rem] border border-outline-variant bg-white px-md py-sm">
            <p className="text-label-md uppercase tracking-[0.06em] text-secondary">
              Payment
            </p>
            <p className="mt-xs text-body-lg text-on-surface">
              Cash on Delivery
            </p>
          </div>

          <div className="space-y-sm">
            {itemsList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant px-md py-sm"
              >
                <span className="text-body-md text-on-surface">
                  {item.product_name}{" "}
                  <span className="text-on-surface-variant">× {item.quantity}</span>
                </span>
                <span className="text-body-md text-on-surface">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-sm">
              <span className="text-title-lg text-on-surface">Total</span>
              <span className="font-display text-headline-md text-primary">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-sm">
            <Link href="/track" className="btn-primary">
              Track this order
            </Link>
            <Link href="/store" className="btn-secondary">
              Keep shopping
            </Link>
            <Link href="/" className="btn-secondary">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}