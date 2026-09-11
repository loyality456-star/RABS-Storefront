"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LeafMark } from "@/components/Leaf";
import { useCart } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/store", label: "Store" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count, setDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/90 backdrop-blur">
      <nav className="container-site flex h-16 items-center justify-between gap-md">
        <Link href="/" className="flex items-center gap-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <LeafMark className="h-5 w-5" />
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="font-display text-title-lg text-on-surface">
              RABS
            </span>
            <span className="text-label-sm text-on-surface-variant">
              Roots & Botanical Solutions
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-md md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-label-lg transition-colors ${
                pathname === link.href
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-primary-container transition-colors hover:bg-parchment"
            aria-label="Open cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-primary-container md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-outline-variant bg-surface md:hidden">
          <div className="container-site flex flex-col gap-sm py-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-xs text-body-lg ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <CartDrawer />
    </header>
  );
}