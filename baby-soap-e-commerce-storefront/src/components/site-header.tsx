"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart/cart-context";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?collection=newborn-essentials", label: "Newborn" },
  { href: "/shop?collection=sensitive-skin", label: "Sensitive Skin" },
  { href: "/shop?collection=calm-and-bedtime", label: "Bedtime" },
  { href: "/shop?collection=gift-sets", label: "Gifts" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      k<span className="italic text-blush-500">A</span>v<span className="italic text-sage-500">I</span>
    </span>
  );
}

export function SiteHeader() {
  const { count, open, hydrated } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hydrated || count === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count, hydrated]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const isCheckout = pathname.startsWith("/checkout");

  return (
    <>
      {!isCheckout && (
        <div className="relative overflow-hidden bg-sage-700 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream-50">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12">
                <span>Free shipping on orders over $40</span>
                <span>✦</span>
                <span>Use code WELCOME10 for 10% off</span>
                <span>✦</span>
                <span>Pediatrician &amp; dermatologist tested</span>
                <span>✦</span>
                <span>Handmade in small batches</span>
                <span>✦</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-cream-300/80 bg-cream-50/85 backdrop-blur-md" : "bg-cream-50"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="-ml-2 p-2" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <Link href="/" className="text-3xl lg:text-4xl" aria-label="kAvI home">
            <Logo />
          </Link>
          {!isCheckout && (
            <nav className="hidden items-center gap-8 lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="group relative text-sm text-ink-700 transition hover:text-ink-900"
                >
                  {n.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-1">
            {!isCheckout && (
              <button onClick={() => setSearchOpen((s) => !s)} className="p-2" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            )}
            <button onClick={open} className="relative -mr-2 p-2" aria-label="Open cart">
              <ShoppingBag className={`h-5 w-5 transition-transform ${bump ? "scale-125" : ""}`} />
              {hydrated && count > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-blush-500 px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="animate-fade-in border-t border-cream-300 bg-cream-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/shop?q=${encodeURIComponent(query)}`);
              }}
              className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4"
            >
              <Search className="h-5 w-5 text-ink-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lavender, oat, gift sets…"
                className="flex-1 bg-transparent font-serif text-xl outline-none placeholder:text-ink-300"
              />
              <button type="submit" className="rounded-full bg-ink-900 px-5 py-2 text-sm text-cream-50">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink-900/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-cream-50 p-6 shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo className="text-3xl" />
            <button onClick={() => setMenuOpen(false)} className="p-2" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="border-b border-cream-300 py-4 font-serif text-2xl">
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="mt-10 text-sm text-ink-500">Gentle soaps for tiny humans. Handmade with love.</p>
        </div>
      </div>
    </>
  );
}
