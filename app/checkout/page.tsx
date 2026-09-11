import type { Metadata } from "next";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-site py-3xl">
      <div className="mx-auto max-w-2xl">
        <Link href="/store" className="eyebrow hover:underline">
          ← Continue shopping
        </Link>
        <h1 className="mt-sm font-display text-display-lg-mobile text-on-surface sm:text-headline-lg">
          Checkout
        </h1>
        <div className="mt-md px-xs">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}