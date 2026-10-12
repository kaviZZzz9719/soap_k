import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "kAvI: Gentle Handmade Soap for Babies",
    template: "%s · kAvI Baby Soap",
  },
  description:
    "kAvI makes gentle, handmade soaps for babies: fragrance-free newborn bars, soothing oat for sensitive skin, calming bedtime blends and beautiful gift sets.",
  openGraph: {
    title: "kAvI: Gentle Handmade Soap for Babies",
    description: "Pediatrician-tested, small-batch baby soaps made with clean botanicals.",
    images: ["/images/hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
