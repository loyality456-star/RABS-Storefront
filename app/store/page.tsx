import type { Metadata } from "next";
import { StoreFilters } from "@/app/store/StoreFilters";
import { ensureSchema, listCategories, listProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Store" };

export const dynamic = "force-dynamic";

export default async function StorePage() {
  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];

  try {
    await ensureSchema();
    [products, categories] = await Promise.all([
      listProducts(true),
      listCategories(),
    ]);
  } catch (err) {
    console.error("Store page data load failed", err);
  }

  return (
    <div className="container-site py-3xl">
      <div className="mb-xl text-center">
        <span className="eyebrow">The apothecary</span>
        <h1 className="mt-xs font-display text-display-lg-mobile text-on-surface sm:text-display-lg">
          Store
        </h1>
        <p className="mx-auto mt-sm max-w-xl text-body-lg text-on-surface-variant">
          Every remedy is brewed fresh in small batches. Featured blends show up
          first; filter by category to find your fit.
        </p>
      </div>

      {categories.length === 0 && products.length === 0 ? (
        <div className="card py-3xl text-center">
          <p className="font-display text-headline-sm text-on-surface">
            The shelves are being stocked
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Add products from the RABS management portal and they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <StoreFilters products={products} categories={categories} />
      )}
    </div>
  );
}