"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "./cart/cart-context";
import { Stars } from "./ui";
import { formatPrice } from "@/lib/pricing";

export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  compareAtCents: number | null;
  images: string[];
  badge: string | null;
  rating: number;
  reviewCount: number;
  scent: string;
};

export function ProductCard({ product, priority = false }: { product: CardProduct; priority?: boolean }) {
  const { addItem } = useCart();
  const [primary, secondary] = product.images;

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        {secondary && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={secondary}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-900 shadow-sm">
            {product.badge}
          </span>
        )}
        {product.compareAtCents && (
          <span className="absolute right-3 top-3 rounded-full bg-blush-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Save {Math.round((1 - product.priceCents / product.compareAtCents) * 100)}%
          </span>
        )}
      </Link>
      <button
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            tagline: product.tagline,
            image: primary,
            priceCents: product.priceCents,
          })
        }
        className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream-50 text-ink-900 shadow-lg transition-all duration-300 hover:bg-ink-900 hover:text-cream-50 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        aria-label={`Add ${product.name} to bag`}
      >
        <Plus className="h-5 w-5" />
      </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <Stars rating={product.rating} size={12} />
          <span>({product.reviewCount})</span>
        </div>
        <Link href={`/products/${product.slug}`} className="mt-1.5 font-serif text-xl leading-snug hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-ink-500">{product.tagline}</p>
        <p className="mt-2 flex items-baseline gap-2 text-sm font-medium">
          {formatPrice(product.priceCents)}
          {product.compareAtCents && (
            <span className="text-xs font-normal text-ink-300 line-through">{formatPrice(product.compareAtCents)}</span>
          )}
        </p>
      </div>
    </article>
  );
}
