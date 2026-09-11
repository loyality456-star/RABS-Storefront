import type { Metadata } from "next";
import { LeafDivider } from "@/components/Leaf";

export const metadata: Metadata = { title: "About Us" };

const TIMELINE = [
  {
    year: "Ancient roots",
    title: "Herbal wisdom, honoured",
    body: "Long before laboratories, healers turned to bark, root, seed and petal. Our formulations begin where those traditions left off — botanically documented, ethically wilded.",
  },
  {
    year: "Modern apothecary",
    title: "Precision meets purity",
    body: "We combine cold maceration with third-party botanical testing. The result is a clean, potent extract you can trust — no fillers, no masking agents, no empty promises.",
  },
  {
    year: "The RABS code",
    title: "Honesty as an ingredient",
    body: "Every label lists what is actually inside a bottle. Every review is read by a human. Every order is packed by hand and delivered with the same care it was brewed with.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-site py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Our story</span>
          <h1 className="mt-xs font-display text-display-lg-mobile text-on-surface sm:text-display-lg">
            Roots &amp; Botanical Solutions
          </h1>
          <p className="mt-lg text-body-lg text-on-surface-variant">
            RABS began with a simple observation: the most powerful medicine
            cabinet ever assembled already grows in the ground. For years we
            studied plant chemistry, traditional phytoformulations and the
            quiet rituals of old apothecaries — until we stopped studying and
            started brewing.
          </p>
        </div>
      </section>

      <LeafDivider className="px-container-site" />

      <section className="container-site py-3xl">
        <div className="grid gap-lg md:grid-cols-2">
          <div>
            <h2 className="font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              Why botanical solutions?
            </h2>
            <div className="mt-md space-y-md text-body-md text-on-surface-variant">
              <p>
                Modern wellness moved at factory speed. We moved the other way.
                Each remedy is grounded in monographs and ethnobotanical record,
                then translated into an extract that fits modern routines — one
                dropper, one capsule, one balm at a time.
              </p>
              <p>
                We believe the body responds best to whole-plant intelligence:
                the interplay of active compounds exactly as nature arranged
                them, rather than single isolated molecules. That belief is in
                every batch we press.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-outline-variant bg-gradient-to-br from-secondary-container/70 via-surface-container to-tertiary-container/40 p-xl shadow-elevation-low">
            <h3 className="font-display text-headline-sm text-on-surface">
              Our commitment
            </h3>
            <ul className="mt-md space-y-sm text-body-md text-on-surface-variant">
              {[
                "Traceable, named sourcing for every botanical",
                "Small-batch brewing for consistent potency",
                "Third-party tested extracts, published openly",
                "Plastic-conscious, refill-friendly packaging",
                "Reading and replying to every customer review",
              ].map((item) => (
                <li key={item} className="flex items-start gap-sm">
                  <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary-container">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                      <path d="M4 10.5l4 4 8-8-1.5-1.5L8 11.5 5.5 9 4 10.5Z" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface-container-low py-3xl">
        <div className="container-site">
          <div className="mb-xl text-center">
            <span className="eyebrow">Where we come from</span>
            <h2 className="mt-xs font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
              A lineage of care
            </h2>
          </div>
          <div className="grid gap-lg md:grid-cols-3">
            {TIMELINE.map((item) => (
              <div key={item.title} className="card">
                <span className="text-label-md uppercase tracking-[0.08em] text-secondary">
                  {item.year}
                </span>
                <h3 className="mt-xs font-display text-headline-sm text-on-surface">
                  {item.title}
                </h3>
                <p className="mt-sm text-body-md text-on-surface-variant">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-3xl text-center">
        <h2 className="font-display text-headline-lg-mobile text-on-surface sm:text-headline-lg">
          Come see what&apos;s on the shelves.
        </h2>
        <a href="/store" className="btn-primary mt-md">
          Explore the store
        </a>
      </section>
    </>
  );
}