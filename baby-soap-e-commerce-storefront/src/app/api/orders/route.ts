import { NextResponse } from "next/server";
import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureDb } from "@/lib/db-init";
import { computeTotals, SHIPPING_METHODS, type ShippingMethodId } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  shippingMethod?: string;
  discountCode?: string;
  card?: { number?: string; expiry?: string; cvc?: string; name?: string };
  items?: { productId: number; quantity: number }[];
};

const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function luhn(num: string) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export async function POST(req: Request) {
  await ensureDb();
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const customer = {
    email: s(body.email, 160),
    firstName: s(body.firstName, 80),
    lastName: s(body.lastName, 80),
    address: s(body.address),
    apartment: s(body.apartment) || null,
    city: s(body.city, 100),
    region: s(body.region, 100),
    postalCode: s(body.postalCode, 20),
    country: s(body.country, 80) || "United States",
    phone: s(body.phone, 40) || null,
  };

  const errors: Record<string, string> = {};
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) errors.email = "Enter a valid email";
  if (!customer.firstName) errors.firstName = "Required";
  if (!customer.lastName) errors.lastName = "Required";
  if (!customer.address) errors.address = "Required";
  if (!customer.city) errors.city = "Required";
  if (!customer.region) errors.region = "Required";
  if (!customer.postalCode) errors.postalCode = "Required";

  const method = (body.shippingMethod ?? "standard") as ShippingMethodId;
  if (!(method in SHIPPING_METHODS)) errors.shippingMethod = "Choose a shipping method";

  const cardNumber = (body.card?.number ?? "").replace(/\D/g, "");
  if (cardNumber.length < 13 || cardNumber.length > 19 || !luhn(cardNumber)) errors.cardNumber = "Card number is invalid";
  const exp = /^(\d{2})\s*\/\s*(\d{2})$/.exec(body.card?.expiry ?? "");
  if (!exp) errors.cardExpiry = "Use MM/YY";
  else {
    const m = Number(exp[1]);
    const y = 2000 + Number(exp[2]);
    const now = new Date();
    if (m < 1 || m > 12 || y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1))
      errors.cardExpiry = "Card has expired";
  }
  if (!/^\d{3,4}$/.test(body.card?.cvc ?? "")) errors.cardCvc = "Invalid CVC";

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the highlighted fields", fields: errors }, { status: 422 });
  }

  const requested = new Map<number, number>();
  for (const item of body.items ?? []) {
    const id = Number(item.productId);
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isInteger(id) || !Number.isFinite(qty) || qty < 1) continue;
    requested.set(id, Math.min(20, (requested.get(id) ?? 0) + qty));
  }
  if (requested.size === 0) return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });

  const rows = await db.select().from(products).where(inArray(products.id, [...requested.keys()]));
  if (rows.length !== requested.size) {
    return NextResponse.json({ error: "Some items in your bag are no longer available" }, { status: 409 });
  }
  for (const p of rows) {
    if (p.inventory < (requested.get(p.id) ?? 0)) {
      return NextResponse.json({ error: `Sorry, only ${p.inventory} of ${p.name} left in stock` }, { status: 409 });
    }
  }

  const subtotal = rows.reduce((sum, p) => sum + p.priceCents * (requested.get(p.id) ?? 0), 0);
  const totals = computeTotals(subtotal, method, body.discountCode);
  const orderNumber = `KV-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  const order = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(orders)
      .values({
        orderNumber,
        ...customer,
        shippingMethod: method,
        subtotalCents: totals.subtotalCents,
        discountCents: totals.discountCents,
        shippingCents: totals.shippingCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents,
        cardLast4: cardNumber.slice(-4),
        status: "paid",
      })
      .returning();
    await tx.insert(orderItems).values(
      rows.map((p) => ({
        orderId: created.id,
        productId: p.id,
        name: p.name,
        image: p.images[0] ?? "",
        unitPriceCents: p.priceCents,
        quantity: requested.get(p.id) ?? 1,
      })),
    );
    for (const p of rows) {
      const qty = requested.get(p.id) ?? 0;
      await tx
        .update(products)
        .set({
          inventory: sql`greatest(${products.inventory} - ${qty}, 0)`,
          popularity: sql`${products.popularity} + 1`,
        })
        .where(inArray(products.id, [p.id]));
    }
    return created;
  });

  return NextResponse.json({ orderNumber: order.orderNumber, totalCents: order.totalCents }, { status: 201 });
}
