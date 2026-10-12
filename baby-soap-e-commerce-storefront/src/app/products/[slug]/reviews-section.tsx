"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Star } from "lucide-react";
import { Stars } from "@/components/ui";

type ReviewItem = {
  id: number;
  author: string;
  location: string | null;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export function ReviewsSection({
  productId,
  reviews,
  rating,
}: {
  productId: number;
  reviews: ReviewItem[];
  rating: number;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [visible, setVisible] = useState(4);
  const [form, setForm] = useState({ author: "", location: "", rating: 0, title: "", body: "" });
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const dist = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: reviews.filter((r) => r.rating === s).length }));
  const shown = useMemo(() => {
    const list = filter ? reviews.filter((r) => r.rating === filter) : [...reviews];
    if (sort === "highest") list.sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") list.sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, filter, sort]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating) {
      setError("Please choose a star rating.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("done");
      setForm({ author: "", location: "", rating: 0, title: "", body: "" });
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
        <div>
          <h2 className="font-serif text-4xl font-light">Reviews</h2>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-serif text-6xl leading-none">{rating.toFixed(1)}</span>
            <div className="pb-1">
              <Stars rating={rating} size={16} />
              <p className="mt-1 text-sm text-ink-500">Based on {reviews.length} reviews</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {dist.map((d) => (
              <button
                key={d.star}
                onClick={() => setFilter(filter === d.star ? null : d.star)}
                className={`flex w-full items-center gap-3 text-sm transition ${filter && filter !== d.star ? "opacity-40" : ""}`}
              >
                <span className="w-6 text-left">{d.star}★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
                  <span
                    className="block h-full rounded-full bg-honey-400"
                    style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-6 text-right text-ink-500">{d.count}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setShowForm((s) => !s);
              setStatus("idle");
            }}
            className="mt-8 w-full rounded-full border border-ink-900 py-3.5 text-sm font-medium transition hover:bg-ink-900 hover:text-cream-50"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        </div>

        <div>
          {showForm && (
            <div className="mb-10 animate-fade-up rounded-3xl bg-cream-100 p-6 sm:p-8">
              {status === "done" ? (
                <div className="py-6 text-center">
                  <p className="font-serif text-2xl">Thank you! 💛</p>
                  <p className="mt-2 text-sm text-ink-500">Your review has been published.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Your rating</p>
                    <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onMouseEnter={() => setHover(s)}
                          onClick={() => setForm({ ...form, rating: s })}
                          aria-label={`${s} stars`}
                        >
                          <Star
                            className={`h-7 w-7 transition ${(hover || form.rating) >= s ? "text-honey-400" : "text-cream-300"}`}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" value={form.author} onChange={(v) => setForm({ ...form, author: v })} required maxLength={60} />
                    <Field label="Location (optional)" value={form.location} onChange={(v) => setForm({ ...form, location: v })} maxLength={60} />
                  </div>
                  <Field label="Review title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required maxLength={100} />
                  <label className="block">
                    <span className="text-sm font-medium">Your review</span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={4}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-ink-900"
                      placeholder="How did your little one's skin respond?"
                    />
                  </label>
                  {error && <p className="text-sm text-red-700">{error}</p>}
                  <button
                    disabled={status === "sending"}
                    className="rounded-full bg-ink-900 px-8 py-3 text-sm font-medium text-cream-50 transition hover:bg-ink-700 disabled:opacity-60"
                  >
                    {status === "sending" ? "Submitting…" : "Submit review"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-b border-cream-300 pb-4 text-sm">
            <span className="text-ink-500">
              {filter ? `${shown.length} ${filter}-star reviews` : `${shown.length} reviews`}
              {filter && (
                <button onClick={() => setFilter(null)} className="ml-2 underline">
                  Show all
                </button>
              )}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-ink-900/15 bg-cream-50 px-3 py-1.5 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          <ul className="divide-y divide-cream-300">
            {shown.slice(0, visible).map((r) => (
              <li key={r.id} className="animate-fade-in py-7">
                <div className="flex items-center justify-between gap-4">
                  <Stars rating={r.rating} />
                  <time className="text-xs text-ink-500">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <h3 className="mt-3 font-serif text-xl">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{r.body}</p>
                <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush-100 text-xs font-semibold text-blush-500">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium">{r.author}</span>
                  {r.location && <span className="text-ink-500">· {r.location}</span>}
                  {r.verified && (
                    <span className="flex items-center gap-1 text-xs text-sage-700">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified buyer
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
          {visible < shown.length && (
            <button
              onClick={() => setVisible((v) => v + 4)}
              className="mt-4 rounded-full border border-ink-900/20 px-6 py-3 text-sm transition hover:border-ink-900"
            >
              Load more reviews
            </button>
          )}
          {shown.length === 0 && <p className="py-10 text-center text-ink-500">No reviews here yet. Be the first!</p>}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-ink-900"
      />
    </label>
  );
}
