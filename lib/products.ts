import { nanoid } from "nanoid";
import { execute, query, queryOne } from "@/lib/db";
import { SCHEMA_SQL } from "@/lib/schema";
import type { Category, ProductWithCategory, Review } from "@/lib/schema";

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;
  await execute(SCHEMA_SQL);
  initialized = true;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listProducts(activeOnly = true): Promise<ProductWithCategory[]> {
  return query<ProductWithCategory>(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${activeOnly ? "WHERE p.is_active = 1" : ""}
     ORDER BY p.is_featured DESC, p.created_at DESC`
  );
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  return queryOne<ProductWithCategory>(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.is_active = 1`,
    [slug]
  );
}

export async function listCategories(): Promise<Category[]> {
  return query<Category>("SELECT * FROM categories ORDER BY name ASC");
}

export async function listReviews(productId: string): Promise<Review[]> {
  return query<Review>(
    "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
    [productId]
  );
}

export function newId(): string {
  return nanoid();
}