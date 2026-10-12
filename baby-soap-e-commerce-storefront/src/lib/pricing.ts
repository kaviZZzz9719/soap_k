export const FREE_SHIPPING_THRESHOLD = 4000;
export const TAX_RATE = 0.08;

export const SHIPPING_METHODS = {
  standard: { id: "standard", label: "Standard", detail: "3–5 business days", priceCents: 595 },
  express: { id: "express", label: "Express", detail: "1–2 business days", priceCents: 1295 },
} as const;

export type ShippingMethodId = keyof typeof SHIPPING_METHODS;

export const DISCOUNT_CODES: Record<string, { percent: number; label: string }> = {
  WELCOME10: { percent: 10, label: "10% off your first order" },
  BABYLOVE: { percent: 15, label: "15% off. Thanks for the love!" },
};

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function computeTotals(subtotalCents: number, method: ShippingMethodId, discountCode?: string | null) {
  const code = discountCode ? DISCOUNT_CODES[discountCode.trim().toUpperCase()] : undefined;
  const discountCents = code ? Math.round((subtotalCents * code.percent) / 100) : 0;
  const discounted = subtotalCents - discountCents;
  let shippingCents: number = SHIPPING_METHODS[method].priceCents;
  if (method === "standard" && discounted >= FREE_SHIPPING_THRESHOLD) shippingCents = 0;
  if (subtotalCents === 0) shippingCents = 0;
  const taxCents = Math.round(discounted * TAX_RATE);
  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents: discounted + shippingCents + taxCents,
    discountValid: Boolean(code),
  };
}
