import { db, pool } from "@/db";
import { collections, products, reviews } from "@/db/schema";
import { seedCollections, seedProducts } from "./seed-data";

const DDL = `
CREATE TABLE IF NOT EXISTS collections (
  id serial PRIMARY KEY,
  slug varchar(120) NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  accent varchar(32) NOT NULL DEFAULT '#f3e7dc',
  sort_order integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  slug varchar(160) NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  price_cents integer NOT NULL,
  compare_at_cents integer,
  collection_slug varchar(120) NOT NULL,
  format varchar(40) NOT NULL,
  scent varchar(60) NOT NULL,
  skin_concerns jsonb NOT NULL DEFAULT '[]'::jsonb,
  age_range varchar(60) NOT NULL,
  size varchar(60) NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ingredients text NOT NULL,
  how_to_use text NOT NULL,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  badge varchar(40),
  is_featured boolean NOT NULL DEFAULT false,
  inventory integer NOT NULL DEFAULT 100,
  popularity integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  product_id integer NOT NULL,
  author text NOT NULL,
  location text,
  rating integer NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  order_number varchar(40) NOT NULL UNIQUE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  address text NOT NULL,
  apartment text,
  city text NOT NULL,
  region text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  phone text,
  shipping_method varchar(40) NOT NULL,
  subtotal_cents integer NOT NULL,
  discount_cents integer NOT NULL DEFAULT 0,
  shipping_cents integer NOT NULL,
  tax_cents integer NOT NULL,
  total_cents integer NOT NULL,
  card_last4 varchar(4),
  status varchar(30) NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
  id serial PRIMARY KEY,
  order_id integer NOT NULL,
  product_id integer NOT NULL,
  name text NOT NULL,
  image text NOT NULL,
  unit_price_cents integer NOT NULL,
  quantity integer NOT NULL
);
`;

const DAY = 24 * 60 * 60 * 1000;

async function initialize() {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(424242)");
    await client.query(DDL);
    const { rows } = await client.query<{ count: string }>("SELECT count(*)::text AS count FROM products");
    if (Number(rows[0]?.count ?? 0) > 0) return;

    await db.insert(collections).values(seedCollections).onConflictDoNothing();

    const now = Date.now();
    for (const p of seedProducts) {
      const { reviews: productReviews, daysOld, ...rest } = p;
      const [inserted] = await db
        .insert(products)
        .values({
          ...rest,
          compareAtCents: rest.compareAtCents ?? null,
          badge: rest.badge ?? null,
          isFeatured: rest.isFeatured ?? false,
          createdAt: new Date(now - daysOld * DAY),
        })
        .onConflictDoNothing()
        .returning({ id: products.id });
      if (!inserted) continue;
      if (productReviews.length) {
        await db.insert(reviews).values(
          productReviews.map((r) => ({
            productId: inserted.id,
            author: r.author,
            location: r.location,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: true,
            createdAt: new Date(now - r.daysAgo * DAY),
          })),
        );
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(424242)").catch(() => {});
    client.release();
  }
}

const g = globalThis as typeof globalThis & { __kaviInit?: Promise<void> };

export function ensureDb(): Promise<void> {
  if (!g.__kaviInit) {
    g.__kaviInit = initialize().catch((err) => {
      g.__kaviInit = undefined;
      throw err;
    });
  }
  return g.__kaviInit;
}
