"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, Loader2, Lock, Tag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { computeTotals, DISCOUNT_CODES, formatPrice, SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD, type ShippingMethodId } from "@/lib/pricing";

type Step = 1 | 2 | 3;

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotalCents, hydrated, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<ShippingMethodId>("standard");
  const [codeInput, setCodeInput] = useState("");
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [info, setInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const totals = computeTotals(subtotalCents, method, discountCode);
  const set = (k: keyof typeof info) => (v: string) => setInfo((p) => ({ ...p, [k]: v }));

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(info.email)) e.email = "Enter a valid email";
    (["firstName", "lastName", "address", "city", "region", "postalCode"] as const).forEach((k) => {
      if (!info[k].trim()) e[k] = "Required";
    });
    if (info.postalCode && !/^[A-Za-z0-9 -]{3,10}$/.test(info.postalCode)) e.postalCode = "Invalid postal code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    const e: Record<string, string> = {};
    const digits = card.number.replace(/\D/g, "");
    if (digits.length < 13) e.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry)) e.cardExpiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(card.cvc)) e.cardCvc = "Invalid";
    if (!card.name.trim()) e.cardName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCode = () => {
    const code = codeInput.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setDiscountCode(code);
      setCodeError("");
      setCodeInput("");
    } else setCodeError("That code isn't valid");
  };

  const placeOrder = async () => {
    if (!validateCard()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...info,
          shippingMethod: method,
          discountCode,
          card,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { orderNumber?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok || !data.orderNumber) {
        if (data.fields) {
          setErrors(data.fields);
          if (Object.keys(data.fields).some((k) => !k.startsWith("card"))) setStep(1);
        }
        throw new Error(data.error ?? "Payment failed. Please try again.");
      }
      router.push(`/checkout/success/${data.orderNumber}`);
      clear();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-500" />
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-4xl font-light">Your bag is empty</h1>
        <p className="mt-3 text-ink-500">Add a few gentle soaps before heading to checkout.</p>
        <Link href="/shop" className="mt-8 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-cream-50">
          Continue shopping
        </Link>
      </div>
    );
  }

  const summary = (
    <div>
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.productId} className="flex items-center gap-4">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-700 px-1 text-[10px] font-semibold text-white">
                {i.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif">{i.name}</p>
              <p className="truncate text-xs text-ink-500">{i.tagline}</p>
            </div>
            <p className="text-sm">{formatPrice(i.priceCents * i.quantity)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-cream-300 pt-6">
        {discountCode ? (
          <div className="flex items-center justify-between rounded-xl bg-sage-100 px-4 py-3 text-sm text-sage-700">
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> <strong>{discountCode}</strong>: {DISCOUNT_CODES[discountCode].label}
            </span>
            <button onClick={() => setDiscountCode(null)} aria-label="Remove code">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCode())}
                placeholder="Discount code"
                className="min-w-0 flex-1 rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm uppercase outline-none placeholder:normal-case focus:border-ink-900"
              />
              <button
                onClick={applyCode}
                disabled={!codeInput.trim()}
                className="rounded-xl bg-ink-900 px-5 text-sm text-cream-50 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
            {codeError && <p className="mt-2 text-xs text-red-700">{codeError}</p>}
            <p className="mt-2 text-xs text-ink-500">Try WELCOME10 for 10% off.</p>
          </div>
        )}
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-cream-300 pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-700">Subtotal</dt>
          <dd>{formatPrice(totals.subtotalCents)}</dd>
        </div>
        {totals.discountCents > 0 && (
          <div className="flex justify-between text-sage-700">
            <dt>Discount</dt>
            <dd>−{formatPrice(totals.discountCents)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-700">Shipping</dt>
          <dd>{step === 1 && method === "standard" && totals.shippingCents > 0 ? "Calculated next" : totals.shippingCents === 0 ? "Free" : formatPrice(totals.shippingCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-700">Estimated tax</dt>
          <dd>{formatPrice(totals.taxCents)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-cream-300 pt-4">
          <dt className="font-medium">Total</dt>
          <dd className="font-serif text-2xl">
            <span className="mr-1 text-xs text-ink-500">USD</span>
            {formatPrice(totals.totalCents)}
          </dd>
        </div>
      </dl>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-14">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
        <ChevronLeft className="h-4 w-4" /> Continue shopping
      </Link>

      {/* Mobile summary toggle */}
      <div className="mt-6 rounded-2xl border border-cream-300 bg-cream-100 lg:hidden">
        <button onClick={() => setSummaryOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-4 text-sm">
          <span className="text-sage-700 underline underline-offset-4">{summaryOpen ? "Hide" : "Show"} order summary</span>
          <span className="font-serif text-lg">{formatPrice(totals.totalCents)}</span>
        </button>
        {summaryOpen && <div className="animate-fade-in border-t border-cream-300 p-5">{summary}</div>}
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_420px]">
        <div>
          <h1 className="font-serif text-4xl font-light">Checkout</h1>
          <ol className="mt-6 flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
            {["Information", "Delivery", "Payment"].map((label, i) => {
              const n = (i + 1) as Step;
              const done = step > n;
              return (
                <li key={label} className="flex items-center gap-2 sm:gap-4">
                  <button
                    disabled={!done}
                    onClick={() => setStep(n)}
                    className={`flex items-center gap-2 ${step === n ? "font-medium text-ink-900" : done ? "text-ink-700 hover:underline" : "text-ink-300"}`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                        done ? "bg-sage-500 text-white" : step === n ? "bg-ink-900 text-cream-50" : "border border-ink-300"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
                    </span>
                    {label}
                  </button>
                  {i < 2 && <span className="h-px w-6 bg-cream-300 sm:w-12" />}
                </li>
              );
            })}
          </ol>

          {/* STEP 1 */}
          {step === 1 && (
            <form
              className="mt-10 animate-fade-up space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateInfo()) setStep(2);
              }}
              noValidate
            >
              <fieldset>
                <legend className="font-serif text-2xl">Contact</legend>
                <div className="mt-4">
                  <Input label="Email" type="email" autoComplete="email" value={info.email} onChange={set("email")} error={errors.email} />
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-serif text-2xl">Shipping address</legend>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="First name" autoComplete="given-name" value={info.firstName} onChange={set("firstName")} error={errors.firstName} />
                  <Input label="Last name" autoComplete="family-name" value={info.lastName} onChange={set("lastName")} error={errors.lastName} />
                  <div className="sm:col-span-2">
                    <Input label="Address" autoComplete="address-line1" value={info.address} onChange={set("address")} error={errors.address} />
                  </div>
                  <div className="sm:col-span-2">
                    <Input label="Apartment, suite, etc. (optional)" autoComplete="address-line2" value={info.apartment} onChange={set("apartment")} />
                  </div>
                  <Input label="City" autoComplete="address-level2" value={info.city} onChange={set("city")} error={errors.city} />
                  <label className="block">
                    <span className="text-xs font-medium text-ink-700">State</span>
                    <select
                      value={info.region}
                      onChange={(e) => set("region")(e.target.value)}
                      className={`mt-1.5 w-full rounded-xl border bg-cream-50 px-4 py-3.5 text-sm outline-none transition focus:border-ink-900 ${
                        errors.region ? "border-red-400" : "border-cream-300"
                      }`}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {errors.region && <span className="mt-1 block text-xs text-red-700">{errors.region}</span>}
                  </label>
                  <Input label="ZIP code" autoComplete="postal-code" value={info.postalCode} onChange={set("postalCode")} error={errors.postalCode} />
                  <Input label="Phone (optional)" type="tel" autoComplete="tel" value={info.phone} onChange={set("phone")} />
                </div>
              </fieldset>
              <button className="w-full rounded-full bg-ink-900 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700 sm:w-auto sm:px-12">
                Continue to delivery
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="mt-10 animate-fade-up space-y-8">
              <Recap info={info} onEdit={() => setStep(1)} />
              <fieldset>
                <legend className="font-serif text-2xl">Delivery method</legend>
                <div className="mt-4 space-y-3">
                  {(Object.keys(SHIPPING_METHODS) as ShippingMethodId[]).map((id) => {
                    const m = SHIPPING_METHODS[id];
                    const price = computeTotals(subtotalCents, id, discountCode).shippingCents;
                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                          method === id ? "border-ink-900 bg-cream-100" : "border-cream-300 hover:border-ink-300"
                        }`}
                      >
                        <input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="accent-ink-900" />
                        <span className="flex-1">
                          <span className="block text-sm font-medium">{m.label}</span>
                          <span className="block text-xs text-ink-500">{m.detail}</span>
                        </span>
                        <span className="text-sm font-medium">{price === 0 ? "Free" : formatPrice(price)}</span>
                      </label>
                    );
                  })}
                </div>
                {subtotalCents - totals.discountCents < FREE_SHIPPING_THRESHOLD && (
                  <p className="mt-3 text-xs text-ink-500">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - (subtotalCents - totals.discountCents))} more for free standard shipping.
                  </p>
                )}
              </fieldset>
              <div className="flex flex-col-reverse items-center gap-4 sm:flex-row">
                <button onClick={() => setStep(1)} className="text-sm text-ink-500 hover:text-ink-900">
                  ← Back to information
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full rounded-full bg-ink-900 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700 sm:ml-auto sm:w-auto sm:px-12"
                >
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="mt-10 animate-fade-up space-y-8">
              <Recap info={info} method={method} onEdit={() => setStep(1)} />
              <fieldset>
                <legend className="flex items-center gap-2 font-serif text-2xl">Payment</legend>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                  <Lock className="h-3 w-3" /> All transactions are secure and encrypted.
                </p>
                <div className="mt-4 rounded-2xl border border-cream-300 bg-cream-100 p-5">
                  <div className="mb-4 flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Credit card
                    </span>
                    <span className="text-xs text-ink-500">Visa · MC · Amex</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        label="Card number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="4242 4242 4242 4242"
                        value={card.number}
                        onChange={(v) =>
                          setCard((c) => ({ ...c, number: v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim() }))
                        }
                        error={errors.cardNumber}
                      />
                    </div>
                    <Input
                      label="Expiration (MM/YY)"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="12/28"
                      value={card.expiry}
                      onChange={(v) => {
                        const d = v.replace(/\D/g, "").slice(0, 4);
                        setCard((c) => ({ ...c, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                      }}
                      error={errors.cardExpiry}
                    />
                    <Input
                      label="Security code"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(v) => setCard((c) => ({ ...c, cvc: v.replace(/\D/g, "").slice(0, 4) }))}
                      error={errors.cardCvc}
                    />
                    <div className="sm:col-span-2">
                      <Input label="Name on card" autoComplete="cc-name" value={card.name} onChange={(v) => setCard((c) => ({ ...c, name: v }))} error={errors.cardName} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-ink-500">
                    Demo store: use test card <button type="button" className="font-mono underline" onClick={() => setCard({ number: "4242 4242 4242 4242", expiry: "12/30", cvc: "123", name: `${info.firstName} ${info.lastName}`.trim() || "Test Parent" })}>4242 4242 4242 4242</button>. No real charge is made.
                  </p>
                </div>
              </fieldset>
              {serverError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{serverError}</p>}
              <div className="flex flex-col-reverse items-center gap-4 sm:flex-row">
                <button onClick={() => setStep(2)} className="text-sm text-ink-500 hover:text-ink-900">
                  ← Back to delivery
                </button>
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700 disabled:opacity-70 sm:ml-auto sm:w-auto sm:px-12"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Pay {formatPrice(totals.totalCents)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl bg-cream-100 p-8">
            <h2 className="mb-6 font-serif text-2xl">Order summary</h2>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Recap({
  info,
  method,
  onEdit,
}: {
  info: { email: string; firstName: string; lastName: string; address: string; apartment: string; city: string; region: string; postalCode: string };
  method?: ShippingMethodId;
  onEdit: () => void;
}) {
  return (
    <div className="divide-y divide-cream-300 rounded-2xl border border-cream-300 text-sm">
      <div className="flex items-start gap-4 p-4">
        <span className="w-20 shrink-0 text-ink-500">Contact</span>
        <span className="flex-1 break-all">{info.email}</span>
        <button onClick={onEdit} className="text-xs underline">Change</button>
      </div>
      <div className="flex items-start gap-4 p-4">
        <span className="w-20 shrink-0 text-ink-500">Ship to</span>
        <span className="flex-1">
          {info.firstName} {info.lastName}, {info.address}
          {info.apartment && `, ${info.apartment}`}, {info.city}, {info.region} {info.postalCode}
        </span>
        <button onClick={onEdit} className="text-xs underline">Change</button>
      </div>
      {method && (
        <div className="flex items-start gap-4 p-4">
          <span className="w-20 shrink-0 text-ink-500">Method</span>
          <span className="flex-1">
            {SHIPPING_METHODS[method].label} · {SHIPPING_METHODS[method].detail}
          </span>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  error,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-700">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-cream-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-ink-900 ${
          error ? "border-red-400" : "border-cream-300"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
