"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/Button";

export function AddToCart({
  productId,
  slug,
  name,
  price,
  imageUrl,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-sm">
      <div className="flex items-center rounded-[0.5rem] border border-outline-variant">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-on-surface-variant hover:text-primary"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-10 text-center text-body-lg">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-on-surface-variant hover:text-primary"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <Button
        onClick={() => add({ productId, slug, name, price, imageUrl }, qty)}
        className="flex-1 sm:flex-none"
      >
        Add to cart
      </Button>
    </div>
  );
}