import type { ProductWithRating } from "./queries";
import type { CardProduct } from "@/components/product-card";

export function toCard(p: ProductWithRating): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    images: p.images.slice(0, 2),
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviewCount,
    scent: p.scent,
  };
}
