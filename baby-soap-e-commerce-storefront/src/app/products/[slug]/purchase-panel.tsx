"use client";

import { useState } from "react";
import { Check, Gift, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/pricing";

type Props = {
  product: {
    id: number;
    slug: string;
    name: string;
    tagline: string;
    priceCents: number;
    compareAtCents: number | null;
    image: string;
    inventory: number;
  };
};

export function PurchasePanel({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const lowStock = product.inventory > 0 && product.inventory < 60;

  const add = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        tagline: product.tagline,
        image: product.image,
        priceCents: product.priceCents,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl">{formatPrice(product.priceCents)}</span>
        {product.compareAtCents && (
          <>
            <span className="text-lg text-ink-300 line-through">{formatPrice(product.compareAtCents)}</span>
            <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-xs font-medium text-blush-500">
              Save {formatPrice(product.compareAtCents - product.priceCents)}
            </span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-500">
        or 4 interest-free payments of {formatPrice(Math.ceil(product.priceCents / 4))}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${lowStock ? "bg-honey-400" : "bg-sage-500"} animate-pulse`} />
        {lowStock ? <span>Only {product.inventory} left, selling fast</span> : <span>In stock, ships within 24 hours</span>}
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex items-center rounded-full border border-ink-900/15">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-4" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center tabular-nums">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="p-4" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={add}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-medium tracking-wide text-cream-50 transition-all duration-300 ${
            added ? "bg-sage-700" : "bg-ink-900 hover:bg-ink-700"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added to bag
            </>
          ) : (
            <>Add to bag · {formatPrice(product.priceCents * qty)}</>
          )}
        </button>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 text-xs text-ink-700">
        <li className="flex items-center gap-2 rounded-xl bg-cream-100 p-3">
          <Truck className="h-4 w-4 text-sage-700" /> Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </li>
        <li className="flex items-center gap-2 rounded-xl bg-cream-100 p-3">
          <RotateCcw className="h-4 w-4 text-sage-700" /> 30-day happiness promise
        </li>
        <li className="flex items-center gap-2 rounded-xl bg-cream-100 p-3">
          <ShieldCheck className="h-4 w-4 text-sage-700" /> Dermatologist tested
        </li>
        <li className="flex items-center gap-2 rounded-xl bg-cream-100 p-3">
          <Gift className="h-4 w-4 text-sage-700" /> Free gift note
        </li>
      </ul>
    </div>
  );
}
