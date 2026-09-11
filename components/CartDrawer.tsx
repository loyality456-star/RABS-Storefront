"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/price";

export default function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, setQuantity, remove, subtotal } =
    useCart();

  return (
    <>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#13231A]/40 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-elevation-high transition-transform duration-300 ${
          drawerOpen
            ? "visible translate-x-0 pointer-events-auto"
            : "invisible translate-x-full pointer-events-none"
        }`}
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
      >
        <header className="flex items-center justify-between border-b border-outline-variant px-lg py-md">
          <h2 className="font-display text-headline-md text-on-surface">Your Cart</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-parchment"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-sm px-lg text-center">
            <span className="text-label-lg uppercase tracking-[0.08em] text-on-surface-variant">
              Your cart is empty
            </span>
            <Link
              href="/store"
              onClick={() => setDrawerOpen(false)}
              className="btn-primary"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-outline-variant overflow-y-auto px-lg">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-sm py-md">
                  <Link
                    href={`/store/${line.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="block h-16 w-16 shrink-0 overflow-hidden rounded-[0.5rem] bg-surface-container"
                  >
                    {line.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={line.imageUrl}
                        alt={line.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container to-secondary-container text-primary-container/60">
                        🌿
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/store/${line.slug}`}
                      className="text-title-md text-on-surface hover:text-primary"
                    >
                      {line.name}
                    </Link>
                    <span className="text-body-sm text-on-surface-variant">
                      {formatPrice(line.price)} each
                    </span>
                    <div className="mt-xs flex items-center justify-between">
                      <div className="flex items-center gap-sm">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-body-md">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.productId)}
                        className="text-body-sm text-on-surface-variant underline underline-offset-2 hover:text-error"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-outline-variant px-lg py-md">
              <div className="flex items-center justify-between">
                <span className="text-label-lg uppercase tracking-[0.06em] text-on-surface-variant">
                  Subtotal
                </span>
                <span className="font-display text-headline-md text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Cash on Delivery — pay when your order arrives.
              </p>
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="btn-primary mt-md w-full"
              >
                Checkout · Cash on Delivery
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}