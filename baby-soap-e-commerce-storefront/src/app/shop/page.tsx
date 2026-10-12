import type { Metadata } from "next";
import Link from "next/link";
import { getCollections, getFilterFacets, getProducts, type ShopFilters } from "@/lib/queries";
import { toCard } from "@/lib/card";
import { ProductCard } from "@/components/product-card";
import { ShopControls } from "./shop-controls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Baby Soaps",
  description: "Browse kAvI's full range of gentle handmade baby soaps, foaming washes and gift sets.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function list(v: string | string[] | undefined) {
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).flatMap((s) => s.split(",")).map((s) => s.trim()).filter(Boolean);
}
function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters: ShopFilters = {
    collection: list(sp.collection),
    format: list(sp.format),
    scent: list(sp.scent),
    concern: list(sp.concern),
    price: one(sp.price),
    rating: Number(one(sp.rating)) || undefined,
    q: one(sp.q),
    sort: one(sp.sort) ?? "featured",
  };

  const [products, collections, facets] = await Promise.all([getProducts(filters), getCollections(), getFilterFacets()]);
  const activeCollection =
    filters.collection?.length === 1 ? collections.find((c) => c.slug === filters.collection![0]) : undefined;

  return (
    <div>
      <section className="border-b border-cream-300 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <nav className="text-xs text-ink-500">
            <Link href="/" className="hover:text-ink-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-ink-900">Shop</Link>
            {activeCollection && (
              <>
                <span className="mx-2">/</span>
                <span className="text-ink-900">{activeCollection.name}</span>
              </>
            )}
          </nav>
          <h1 className="mt-4 animate-fade-up font-serif text-5xl font-light sm:text-6xl">
            {filters.q ? (
              <>Results for <span className="italic">&ldquo;{filters.q}&rdquo;</span></>
            ) : activeCollection ? (
              activeCollection.name
            ) : (
              <>Shop <span className="italic text-blush-500">all</span></>
            )}
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-ink-700 [animation-delay:100ms]">
            {activeCollection
              ? activeCollection.description
              : "Gentle, handmade cleansers for every stage, from the very first bath to splashy toddler adventures."}
          </p>
          <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
            <Link
              href="/shop"
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${
                !filters.collection?.length ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-900/15 hover:border-ink-900"
              }`}
            >
              All
            </Link>
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?collection=${c.slug}`}
                className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${
                  activeCollection?.slug === c.slug
                    ? "border-ink-900 bg-ink-900 text-cream-50"
                    : "border-ink-900/15 hover:border-ink-900"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopControls
          resultCount={products.length}
          collections={collections.map((c) => ({ value: c.slug, label: c.name }))}
          facets={facets}
        >
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-cream-100 px-6 py-24 text-center">
              <p className="font-serif text-3xl">No soaps match those filters</p>
              <p className="mt-2 text-ink-500">Try removing a filter or two. Your perfect bar is in here somewhere.</p>
              <Link href="/shop" className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm text-cream-50">
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                  <ProductCard product={toCard(p)} priority={i < 3} />
                </div>
              ))}
            </div>
          )}
        </ShopControls>
      </div>
    </div>
  );
}
