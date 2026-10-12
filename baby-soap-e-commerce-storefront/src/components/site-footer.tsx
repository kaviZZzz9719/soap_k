import Link from "next/link";
import { Logo } from "./site-header";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-900 text-cream-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo className="text-5xl text-cream-50" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-300">
            Gentle, handmade soaps for babies, crafted in small batches with clean botanicals and endless care.
            Because their first skin deserves the softest start.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-50">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/shop" className="hover:text-white">All Soaps</Link></li>
              <li><Link href="/shop?collection=newborn-essentials" className="hover:text-white">Newborn</Link></li>
              <li><Link href="/shop?collection=sensitive-skin" className="hover:text-white">Sensitive Skin</Link></li>
              <li><Link href="/shop?collection=gift-sets" className="hover:text-white">Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-50">Help</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><span>Shipping &amp; Returns</span></li>
              <li><span>Ingredient Glossary</span></li>
              <li><span>FAQ</span></li>
              <li><a href="mailto:hello@kavi.baby" className="hover:text-white">hello@kavi.baby</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-50">Promise</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>Cruelty-free</li>
              <li>Plastic-free bars</li>
              <li>30-day happiness</li>
              <li>Derm tested</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-50">Join the kAvI family</h3>
          <p className="mt-4 text-sm text-cream-300">Bath-time tips, new arrivals and 10% off your first order.</p>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream-300 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} kAvI Baby Soap Co. All rights reserved.</p>
          <p>Visa · Mastercard · Amex · Apple Pay · Shop Pay</p>
        </div>
      </div>
    </footer>
  );
}
