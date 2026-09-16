"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/price";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import { shippingForQuantity, orderTotal } from "@/lib/shipping";

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, count, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      customer_name: form.get("customer_name"),
      phone: form.get("phone"),
      email: form.get("email") || null,
      address: form.get("address"),
      city: form.get("city"),
      notes: form.get("notes") || null,
      items: lines.map((l) => ({
        product_id: l.productId,
        product_name: l.name,
        quantity: l.quantity,
        unit_price: l.price,
      })),
    };

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place your order.");
      clear();
      router.push(`/order-confirmation/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Your cart is empty.{" "}
        <a href="/store" className="text-primary underline underline-offset-2">
          Browse the store
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-lg">
      <fieldset className="card space-y-md">
        <legend className="px-xs font-display text-headline-sm text-on-surface">
          Delivery details
        </legend>
        <div className="grid gap-md sm:grid-cols-2">
          <Input label="Full name" name="customer_name" required placeholder="Your full name" />
          <Input label="Phone" name="phone" required placeholder="03x xxxxxxxx" />
        </div>
        <Input label="Email (optional)" name="email" type="email" placeholder="you@example.com" />
        <Input label="Address" name="address" required placeholder="Street, house, area" />
        <Input label="City" name="city" required placeholder="Your city" />
        <Textarea label="Order notes (optional)" name="notes" rows={3} placeholder="Anything we should know?" />
      </fieldset>

      <fieldset className="card space-y-sm">
        <legend className="px-xs font-display text-headline-sm text-on-surface">
          Payment method
        </legend>
        <div className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant bg-surface-container-low px-md py-sm">
          <div>
            <p className="text-title-md text-on-surface">Cash on Delivery</p>
            <p className="text-body-sm text-on-surface-variant">
              Pay in cash when your order arrives at your door.
            </p>
          </div>
          <span className="chip chip-active">Selected</span>
        </div>
      </fieldset>

      <div className="card space-y-sm">
        <div className="space-y-xs px-md pt-md">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-on-surface-variant">Subtotal</span>
            <span className="text-body-md text-on-surface">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-md text-on-surface-variant">
              Shipping (200 PKR / 5 items)
            </span>
            <span className="text-body-md text-on-surface">{formatPrice(shippingForQuantity(count))}</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-[0.5rem] border border-outline-variant bg-surface-container-low px-md py-sm">
          <span className="text-label-lg uppercase tracking-[0.06em] text-on-surface-variant">
            Total (COD)
          </span>
          <span className="font-display text-headline-md text-primary">
            {formatPrice(orderTotal(subtotal, count))}
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-[0.5rem] border border-error/30 bg-error-container px-md py-sm text-body-md text-error-on">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Placing order…" : "Place order · Cash on Delivery"}
      </Button>
    </form>
  );
}