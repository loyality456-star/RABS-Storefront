"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Select";
import type { Category, ProductWithCategory } from "@/lib/schema";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export function StoreFilters({
  products,
  categories,
}: {
  products: ProductWithCategory[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category_name?.toLowerCase() === category.toLowerCase());
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.is_featured) - Number(a.is_featured) ||
            b.created_at.localeCompare(a.created_at)
        );
    }

    return list;
  }, [products, category, query, sort]);

  return (
    <>
      <div className="mb-xl grid gap-md rounded-[1rem] border border-outline-variant bg-surface-container-low p-md sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="search">Search</label>
          <input
            id="search"
            className="input"
            placeholder="Search remedies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select
            id="category"
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sort">Sort by</label>
          <select
            id="sort"
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mb-md flex flex-wrap items-center justify-between gap-sm">
        <p className="text-body-sm text-on-surface-variant">
          {filtered.length} {filtered.length === 1 ? "remedy" : "remedies"}
        </p>
        <div className="flex flex-wrap gap-xs">
          {category !== "all" && (
            <button type="button" onClick={() => setCategory("all")} className="chip">
              ✕ {category}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card py-3xl text-center">
          <p className="font-display text-headline-sm text-on-surface">
            Nothing on this shelf yet
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Try clearing your filters, or check back soon — the apothecary restocks often.
          </p>
        </div>
      ) : (
        <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}