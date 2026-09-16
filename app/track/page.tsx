"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/price";
import { shippingForQuantity } from "@/lib/shipping";

const STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

const STEP_LABELS: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

interface TrackedItem {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface TrackedOrder {
  id: string;
  customer_name: string;
  status: string;
  payment_method: string;
  total: number;
  city: string;
  phone: string;
  created_at: string;
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Tracking failed.");
      setOrder(data.order);
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tracking failed.");
    } finally {
      setBusy(false);
    }
  }

  const stepIndex = STEPS.indexOf(order?.status as (typeof STEPS)[number]);
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="container-site py-3xl">
      <div className="mx-auto max-w-2xl space-y-lg">
        <div className="text-center">
          <span className="eyebrow">Track your order</span>
          <h1 className="mt-xs font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
            Where is my order?
          </h1>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Enter the order number from your confirmation — it looks like{" "}
            <span className="font-semibold text-primary">#A1b2C3…</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card flex gap-xs p-sm" role="search">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. 8Yl2qC1wZx3VaB4m"
            aria-label="Order number"
            className="min-w-0 flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy || !orderNumber.trim()}
            className="btn-primary shrink-0"
          >
            {busy ? "Tracking…" : "Track"}
          </button>
        </form>

        {error && (
          <div className="rounded-[0.5rem] border border-outline-variant bg-surface-container-low px-md py-sm">
            <p className="text-body-sm text-error">{error}</p>
          </div>
        )}

        {order && !isCancelled && stepIndex >= 0 && (
          <div className="card space-y-lg">
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <div>
                <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  Order #{order.id}
                </p>
                <p className="font-display text-headline-md text-on-surface">
                  {order.customer_name}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Placed {new Date(order.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <span className="rounded-full bg-primary px-md py-xs text-label-md font-semibold text-white lowercase">
                {order.status}
              </span>
            </div>

            <ol className="flex items-start">
              {STEPS.map((step, index) => {
                const done = index <= stepIndex;
                const active = index === stepIndex;
                return (
                  <li
                    key={step}
                    className={`relative flex flex-1 flex-col items-center gap-xs ${
                      index < STEPS.length - 1 ? "" : ""
                    }`}
                  >
                    {index < STEPS.length - 1 && (
                      <span
                        className={`absolute left-1/2 top-[14px] h-[2px] w-full ${
                          index < stepIndex
                            ? "bg-primary"
                            : "bg-outline-variant"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-label-sm ${
                        done
                          ? "bg-primary text-white"
                          : active
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                      aria-hidden="true"
                    >
                      {index < stepIndex ? "✓" : index + 1}
                    </span>
                    <span
                      className={`text-center text-label-md ${
                        done ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {STEP_LABELS[step]}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="space-y-sm">
              <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                Items
              </p>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant px-md py-sm"
                >
                  <span className="text-body-md text-on-surface">
                    {item.product_name}{" "}
                    <span className="text-on-surface-variant">
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="text-body-md text-on-surface">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-sm">
                <span className="text-body-md text-on-surface-variant">
                  Shipping (200 PKR / 5 items)
                </span>
                <span className="text-body-md text-on-surface">
                  {formatPrice(
                    shippingForQuantity(
                      items.reduce((n, item) => n + item.quantity, 0)
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-title-lg text-on-surface">Total</span>
                <span className="font-display text-headline-md text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="rounded-[0.5rem] border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
              <p className="font-semibold text-on-surface">Delivering to</p>
              <p>
                {order.city} · {order.phone}
              </p>
              <p>
                Payment:{" "}
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : order.payment_method}
              </p>
            </div>
          </div>
        )}

        {order && isCancelled && (
          <div className="card space-y-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </div>
            <div>
              <p className="font-display text-headline-md text-on-surface">
                Order {order.customer_name}
              </p>
              <p className="mt-xs text-body-md text-on-surface-variant">
                This order (#{order.id}) was cancelled. If you believe this is a
                mistake, reach out at{" "}
                <span className="font-semibold">{order.phone}</span> or email
                loyality456@gmail.com.
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-body-sm text-on-surface-variant">
          Questions? Email{" "}
          <Link
            href="mailto:loyality456@gmail.com"
            className="text-primary underline underline-offset-2"
          >
            loyality456@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
}