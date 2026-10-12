import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { getCollections, getProductBySlug, getProducts, getReviews } from "@/lib/queries";
import { toCard } from "@/lib/card";
import { ProductCard } from "@/components/product-card";
import { Reveal, Stars } from "@/components/ui";
import { Gallery } from "./gallery";
import { PurchasePanel } from "./purchase-panel";
import { ReviewsSection } from "./reviews-section";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.tagline}. ${product.description.slice(0, 140)}…`,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, collections, sameCollection, bestsellers] = await Promise.all([
    getReviews(product.id),
    getCollections(),
    getProducts({ collection: [product.collectionSlug], sort: "bestselling" }),
    getProducts({ sort: "bestselling" }),
  ]);
  const collection = collections.find((c) => c.slug === product.collectionSlug);
  const related = [...sameCollection, ...bestsellers]
    .filter((p, i, arr) => p.id !== product.id && arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 4);

  const details = [
    { title: "Description", body: product.description, open: true },
    { title: "Ingredients", body: product.ingredients },
    { title: "How to use", body: product.howToUse },
    {
      title: "Shipping & returns",
      body: "Orders ship within 24 hours from our studio. Free standard shipping on orders over $40; express delivery available at checkout. Not the right fit for your little one? Our 30-day happiness promise means we'll refund or exchange, even on opened bars.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "kAvI" },
    aggregateRating: product.reviewCount
      ? { "@type": "AggregateRating", ratingValue: product.rating.toFixed(1), reviewCount: product.reviewCount }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="text-xs text-ink-500">
          <Link href="/" className="hover:text-ink-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-ink-900">Shop</Link>
          {collection && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/shop?collection=${collection.slug}`} className="hover:text-ink-900">
                {collection.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-ink-900">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:py-12">
        <div className="animate-fade-in lg:sticky lg:top-28 lg:self-start">
          <Gallery images={product.images} name={product.name} />
        </div>

        <div className="animate-fade-up">
          {product.badge && (
            <span className="inline-block rounded-full bg-sage-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-700">
              {product.badge}
            </span>
          )}
          <h1 className="mt-4 font-serif text-4xl font-light leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-ink-500">{product.tagline}</p>
          <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-sm hover:underline">
            <Stars rating={product.rating} size={15} />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-ink-500">({product.reviewCount} reviews)</span>
          </a>

          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-cream-300 bg-cream-300 text-center text-xs">
            {[
              { k: "Age", v: product.ageRange },
              { k: "Scent", v: product.scent },
              { k: "Size", v: product.size },
            ].map((x) => (
              <div key={x.k} className="bg-cream-50 px-2 py-3">
                <p className="uppercase tracking-[0.15em] text-ink-500">{x.k}</p>
                <p className="mt-1 font-medium text-ink-900">{x.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <PurchasePanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                tagline: product.tagline,
                priceCents: product.priceCents,
                compareAtCents: product.compareAtCents,
                image: product.images[0],
                inventory: product.inventory,
              }}
            />
          </div>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" /> {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.skinConcerns.map((c) => (
              <Link
                key={c}
                href={`/shop?concern=${encodeURIComponent(c)}`}
                className="rounded-full border border-cream-300 px-3 py-1 text-xs text-ink-700 transition hover:border-ink-900"
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-cream-300">
            {details.map((d) => (
              <details key={d.title} open={d.open} className="group border-b border-cream-300">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-serif text-lg [&::-webkit-details-marker]:hidden">
                  {d.title}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <p className="pb-6 text-sm leading-relaxed text-ink-700">{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ReviewsSection
          productId={product.id}
          rating={product.rating}
          reviews={reviews.map((r) => ({
            id: r.id,
            author: r.author,
            location: r.location,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: r.verified,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </section>

      {related.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-serif text-4xl font-light">You may also love</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={toCard(p)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
