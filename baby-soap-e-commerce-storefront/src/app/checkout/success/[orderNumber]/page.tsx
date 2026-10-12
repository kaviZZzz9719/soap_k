import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CheckCircle2, Mail, Package, Truck } from "lucide-react";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { ensureDb } from "@/lib/db-init";
import { formatPrice, SHIPPING_METHODS, type ShippingMethodId } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function SuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  await ensureDb();
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const method = SHIPPING_METHODS[order.shippingMethod as ShippingMethodId] ?? SHIPPING_METHODS.standard;
  const eta = new Date(order.createdAt.getTime() + (method.id === "express" ? 2 : 5) * 86400000);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="animate-fade-up text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage-100">
          <CheckCircle2 className="h-10 w-10 text-sage-700" strokeWidth={1.5} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-sage-700">Order {order.orderNumber}</p>
        <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
          Thank you, <span className="italic text-blush-500">{order.firstName}</span>!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-700">
          Your order is confirmed and our studio is already wrapping it with care. A confirmation has been sent
          to <strong>{order.email}</strong>.
        </p>
      </div>

      <div className="mt-12 grid animate-fade-up gap-4 [animation-delay:150ms] sm:grid-cols-3">
        {[
          { icon: Mail, title: "Confirmed", text: "Just now" },
          { icon: Package, title: "Hand-packed", text: "Within 24 hours" },
          { icon: Truck, title: "Arrives by", text: eta.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) },
        ].map(({ icon: Icon, title, text }, i) => (
          <div key={title} className={`rounded-2xl p-5 text-center ${i === 0 ? "bg-sage-100" : "bg-cream-100"}`}>
            <Icon className="mx-auto h-5 w-5 text-sage-700" />
            <p className="mt-2 text-sm font-medium">{title}</p>
            <p className="text-xs text-ink-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 animate-fade-up rounded-3xl border border-cream-300 p-6 [animation-delay:250ms] sm:p-8">
        <h2 className="font-serif text-2xl">Order details</h2>
        <ul className="mt-6 divide-y divide-cream-300">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-serif">{i.name}</p>
                <p className="text-xs text-ink-500">
                  Qty {i.quantity} × {formatPrice(i.unitPriceCents)}
                </p>
              </div>
              <p className="text-sm">{formatPrice(i.unitPriceCents * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-cream-300 pt-4 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotalCents)} />
          {order.discountCents > 0 && <Row label="Discount" value={`−${formatPrice(order.discountCents)}`} />}
          <Row label={`Shipping (${method.label})`} value={order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)} />
          <Row label="Tax" value={formatPrice(order.taxCents)} />
          <div className="flex items-baseline justify-between border-t border-cream-300 pt-3">
            <dt className="font-medium">Total paid</dt>
            <dd className="font-serif text-2xl">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
        <div className="mt-8 grid gap-6 border-t border-cream-300 pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-ink-500">Shipping to</p>
            <p className="mt-2 leading-relaxed">
              {order.firstName} {order.lastName}
              <br />
              {order.address}
              {order.apartment && <>, {order.apartment}</>}
              <br />
              {order.city}, {order.region} {order.postalCode}
              <br />
              {order.country}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-ink-500">Payment</p>
            <p className="mt-2">Card ending in {order.cardLast4}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/shop" className="inline-block rounded-full bg-ink-900 px-10 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-700">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
