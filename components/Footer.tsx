import Link from "next/link";
import { LeafMark, LeafDivider } from "@/components/Leaf";

export default function Footer() {
  return (
    <footer className="mt-4xl border-t border-outline-variant bg-surface-container-low">
      <div className="container-site py-2xl">
        <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <LeafMark className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-title-lg text-on-surface">RABS</p>
                <p className="text-label-sm text-on-surface-variant">
                  Roots & Botanical Solutions
                </p>
              </div>
            </div>
            <p className="mt-md text-body-sm text-on-surface-variant">
              Honest botanical remedies, modern wellness. Grown, harvested and
              handcrafted with an age-old reverence for the earth.
            </p>
          </div>

          <div className="flex flex-col gap-xs">
            <p className="text-label-md uppercase tracking-[0.08em] text-primary">
              Explore
            </p>
            <Link href="/" className="text-body-md text-on-surface-variant hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-body-md text-on-surface-variant hover:text-primary">
              About Us
            </Link>
            <Link href="/store" className="text-body-md text-on-surface-variant hover:text-primary">
              Store
            </Link>
          </div>

          <div className="flex flex-col gap-xs">
            <p className="text-label-md uppercase tracking-[0.08em] text-primary">
              Contact
            </p>
            <p className="text-body-md text-on-surface-variant">roots@rabs.store</p>
            <p className="text-body-md text-on-surface-variant">Cash on Delivery nationwide</p>
          </div>
        </div>

        <LeafDivider className="mt-xl" />

        <p className="mt-lg text-center text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} Roots & Botanical Solutions — grown with
          care.
        </p>
      </div>
    </footer>
  );
}