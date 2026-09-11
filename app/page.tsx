import Link from "next/link";
import { LeafDivider } from "@/components/Leaf";
import { ProductCard } from "@/components/ui/ProductCard";
import { ensureSchema, listCategories, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let healthy = true;

  try {
    await ensureSchema();
    const all = await listProducts(true);
    products = all.filter((p) => p.is_featured).concat(all.filter((p) => !p.is_featured));
    categories = await listCategories();
  } catch (err) {
    console.error("Home page data load failed", err);
    healthy = false;
  }

  if (!healthy) {
    return (
      <div className="container-site py-4xl text-center">
        <h1 className="font-display text-headline-lg text-on-surface">
          Apothecary not yet open
        </h1>
        <p className="mx-auto mt-md max-w-xl text-body-lg text-on-surface-variant">
          We&apos;re still brewing. Add your TURSO_DATABASE_URL and
          TURSO_AUTH_TOKEN environment variables, then the shelves will fill up.
        </p>
      </div>
    );
  }

  const featured = products.filter((p) => p.is_featured);
  const rest = products.filter((p) => !p.is_featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-outline-variant bg-gradient-to-b from-surface-container-low via-surface to-surface">
        <div className="container-site flex flex-col items-center gap-lg py-4xl text-center">
          <span className="eyebrow">Roots & Botanical Solutions</span>
          <h1 className="max-w-4xl font-display text-display-lg-mobile text-on-surface sm:text-display-lg">
            Remedies rooted in the earth, crafted for modern wellness.
          </h1>
          <p className="max-w-2xl text-body-lg text-on-surface-variant">
            RABS is a small apothecary honouring ancient botanical wisdom. Pure
            extracts, honest ingredients, and bottles filled by hand with a
            reverence for the plant kingdom.
          </p>
          <div className="mt-sm flex flex-wrap items-center justify-center gap-sm">
            <Link href="/store" className="btn-primary">
              Visit the store
            </Link>
            <Link href="/about" className="btn-secondary">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Category strips */}
      {categories.length > 0 && (
        <section className="container-site pt-2xl">
          <div className="flex flex-wrap justify-center gap-xs">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/store?category=${encodeURIComponent(cat.slug)}`}
                className="chip hover:bg-secondary-container"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <LeafDivider className="py-2xl" />

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-site pb-2xl">
          <div className="mb-xl text-center">
            <span className="eyebrow">Hand-picked</span>
            <h2 className="mt-xs font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Our featured remedies
            </h2>
          </div>
          <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Full shelf teaser */}
      {rest.length > 0 && (
        <section className="border-t border-outline-variant bg-surface-container-low py-2xl">
          <div className="container-site">
            <div className="mb-xl flex items-end justify-between">
              <div>
                <span className="eyebrow">The full apothecary</span>
                <h2 className="mt-xs font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
                  Freshly stocked
                </h2>
              </div>
              <Link href="/store" className="btn-ghost hidden sm:inline-flex">
                View all remedies →
              </Link>
            </div>
            <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
              {rest.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-xl text-center sm:hidden">
              <Link href="/store" className="btn-secondary w-full">
                View all remedies →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="container-site py-2xl">
        <div className="grid gap-lg md:grid-cols-3">
          {[
            {
              title: "Single-origin botanicals",
              body: "Every ingredient has a source we can name, touch and trust — harvested at peak potency.",
            },
            {
              title: "No shortcuts, ever",
              body: "Small-batch macerations and cold extractions. We let time do the work nature demands.",
            },
            {
              title: "Honest on delivery",
              body: "Simple Cash on Delivery. Place your order and pay when it reaches your doorstep.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="font-display text-headline-sm text-on-surface">
                {item.title}
              </h3>
              <p className="mt-sm text-body-md text-on-surface-variant">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-site pb-4xl pt-md">
        <div className="card flex flex-col items-center gap-md bg-gradient-to-br from-primary-container to-secondary-container p-xl text-center shadow-elevation-mid">
          <h2 className="max-w-2xl font-display text-headline-lg-mobile text-white sm:text-headline-lg">
            Bring the apothecary home.
          </h2>
          <p className="max-w-xl text-body-md text-[#E2F6E7]">
            Browse the store, pick your remedies, and we&apos;ll bring them to
            your door — pay on delivery, only when they arrive.
          </p>
          <Link href="/store" className="btn bg-white text-primary-container hover:bg-parchment">
            Start shopping
          </Link>
        </div>
      </section>
    </>
  );
}