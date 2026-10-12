"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { useCart } from "./cart-context";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/pricing";

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem, subtotalCents, count } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-cream-300 px-6 py-5">
          <h2 className="font-serif text-2xl">
            Your Bag <span className="text-base text-ink-500">({count})</span>
          </h2>
          <button onClick={close} className="rounded-full p-2 transition hover:bg-cream-200" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-cream-300 bg-sage-100/60 px-6 py-4">
            <p className="flex items-center gap-2 text-sm text-sage-700">
              <Truck className="h-4 w-4" />
              {remaining > 0 ? (
                <span>
                  You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping
                </span>
              ) : (
                <span>You&apos;ve unlocked <strong>free standard shipping</strong> 🎉</span>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-sage-500 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blush-100">
                <ShoppingBag className="h-8 w-8 text-blush-500" />
              </div>
              <p className="font-serif text-2xl">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-ink-500">
                Discover gentle, handmade soaps for your little one&apos;s softest skin.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="mt-6 rounded-full bg-ink-900 px-7 py-3 text-sm font-medium text-cream-50 transition hover:bg-ink-700"
              >
                Shop all soaps
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cream-300">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-5">
                  <Link href={`/products/${item.slug}`} onClick={close} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={close}
                          className="font-serif text-lg leading-tight hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="truncate text-xs text-ink-500">{item.tagline}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.priceCents * item.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-cream-300">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 text-ink-700 hover:text-ink-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 text-ink-700 hover:text-ink-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-cream-300 bg-cream-100 px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-700">Subtotal</span>
              <span className="font-serif text-2xl">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-500">Taxes and shipping calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={close}
              className="mt-5 block w-full rounded-full bg-ink-900 py-4 text-center text-sm font-medium tracking-wide text-cream-50 transition hover:bg-ink-700"
            >
              Checkout · {formatPrice(subtotalCents)}
            </Link>
            <button
              onClick={close}
              className="mt-3 w-full text-center text-sm text-ink-700 underline-offset-4 hover:underline"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
