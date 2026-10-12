import { and, asc, desc, eq, gte, ilike, inArray, lt, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { collections, products, reviews, type Product } from "@/db/schema";
import { ensureDb } from "./db-init";

export type ProductWithRating = Product & { rating: number; reviewCount: number };

const ratingStats = db
  .select({
    productId: reviews.productId,
    rating: sql<number>`avg(${reviews.rating})::float`.as("rating"),
    reviewCount: sql<number>`count(*)::int`.as("review_count"),
  })
  .from(reviews)
  .groupBy(reviews.productId)
  .as("rating_stats");

function mapRow(row: { product: Product; rating: number | null; reviewCount: number | null }): ProductWithRating {
  return { ...row.product, rating: Number(row.rating ?? 0), reviewCount: Number(row.reviewCount ?? 0) };
}

export type ShopFilters = {
  collection?: string[];
  format?: string[];
  scent?: string[];
  concern?: string[];
  price?: string;
  rating?: number;
  q?: string;
  sort?: string;
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export const PRICE_RANGES = [
  { value: "under-12", label: "Under $12", min: 0, max: 1200 },
  { value: "12-20", label: "$12 – $20", min: 1200, max: 2001 },
  { value: "20-plus", label: "$20 & above", min: 2001, max: null },
] as const;

export async function getProducts(filters: ShopFilters = {}): Promise<ProductWithRating[]> {
  await ensureDb();
  const where: SQL[] = [];
  if (filters.collection?.length) where.push(inArray(products.collectionSlug, filters.collection));
  if (filters.format?.length) where.push(inArray(products.format, filters.format));
  if (filters.scent?.length) where.push(inArray(products.scent, filters.scent));
  if (filters.concern?.length) {
    const parts = filters.concern.map((c) => sql`${products.skinConcerns} @> ${JSON.stringify([c])}::jsonb`);
    const combined = or(...parts);
    if (combined) where.push(combined);
  }
  const range = PRICE_RANGES.find((r) => r.value === filters.price);
  if (range) {
    where.push(gte(products.priceCents, range.min));
    if (range.max !== null) where.push(lt(products.priceCents, range.max));
  }
  if (filters.rating) where.push(sql`coalesce(${ratingStats.rating}, 0) >= ${filters.rating}`);
  if (filters.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    const search = or(ilike(products.name, term), ilike(products.tagline, term), ilike(products.scent, term));
    if (search) where.push(search);
  }

  const orderBy = (() => {
    switch (filters.sort) {
      case "bestselling":
        return [desc(products.popularity)];
      case "newest":
        return [desc(products.createdAt)];
      case "rating":
        return [sql`coalesce(${ratingStats.rating}, 0) desc`, desc(ratingStats.reviewCount)];
      case "price-asc":
        return [asc(products.priceCents), asc(products.id)];
      case "price-desc":
        return [desc(products.priceCents), asc(products.id)];
      default:
        return [desc(products.isFeatured), desc(products.popularity)];
    }
  })();

  const rows = await db
    .select({ product: products, rating: ratingStats.rating, reviewCount: ratingStats.reviewCount })
    .from(products)
    .leftJoin(ratingStats, eq(ratingStats.productId, products.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(...orderBy);
  return rows.map(mapRow);
}

export async function getFeaturedProducts(limit = 4) {
  const all = await getProducts({ sort: "bestselling" });
  return all.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  await ensureDb();
  const rows = await db
    .select({ product: products, rating: ratingStats.rating, reviewCount: ratingStats.reviewCount })
    .from(products)
    .leftJoin(ratingStats, eq(ratingStats.productId, products.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getReviews(productId: number) {
  await ensureDb();
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

export async function getLatestReviews(limit = 6) {
  await ensureDb();
  return db
    .select({ review: reviews, productName: products.name, productSlug: products.slug })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .where(gte(reviews.rating, 5))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export async function getCollections() {
  await ensureDb();
  const rows = await db
    .select({
      collection: collections,
      productCount: sql<number>`(select count(*)::int from ${products} where ${products.collectionSlug} = ${collections.slug})`,
    })
    .from(collections)
    .orderBy(asc(collections.sortOrder));
  return rows.map((r) => ({ ...r.collection, productCount: Number(r.productCount) }));
}

export async function getFilterFacets() {
  await ensureDb();
  const all = await db.select({ scent: products.scent, format: products.format, concerns: products.skinConcerns }).from(products);
  const scents = [...new Set(all.map((p) => p.scent))].sort();
  const formats = [...new Set(all.map((p) => p.format))];
  const concerns = [...new Set(all.flatMap((p) => p.concerns))].sort();
  return { scents, formats, concerns };
}

export async function getStoreStats() {
  await ensureDb();
  const [row] = await db
    .select({ avg: sql<number>`coalesce(avg(${reviews.rating}),0)::float`, count: sql<number>`count(*)::int` })
    .from(reviews);
  return { avgRating: Number(row?.avg ?? 0), reviewCount: Number(row?.count ?? 0) };
}
