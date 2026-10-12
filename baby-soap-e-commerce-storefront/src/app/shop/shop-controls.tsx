"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Stars } from "@/components/ui";

type Option = { value: string; label: string };

const SORTS: Option[] = [
  { value: "featured", label: "Featured" },
  { value: "bestselling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const PRICES: Option[] = [
  { value: "under-12", label: "Under $12" },
  { value: "12-20", label: "$12 – $20" },
  { value: "20-plus", label: "$20 & above" },
];

const FORMAT_LABELS: Record<string, string> = { bar: "Soap bars", wash: "Liquid washes", set: "Gift sets" };

export function ShopControls({
  children,
  resultCount,
  collections,
  facets,
}: {
  children: ReactNode;
  resultCount: number;
  collections: Option[];
  facets: { scents: string[]; formats: string[]; concerns: string[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getList = (key: string) => (searchParams.get(key) ?? "").split(",").filter(Boolean);

  const push = (params: URLSearchParams) => {
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const toggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = getList(key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    push(params);
  };

  const setSingle = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) params.delete(key);
    else params.set(key, value);
    push(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    push(params);
  };

  const sort = searchParams.get("sort") ?? "featured";

  const chips: { key: string; value: string; label: string }[] = [
    ...getList("collection").map((v) => ({ key: "collection", value: v, label: collections.find((c) => c.value === v)?.label ?? v })),
    ...getList("format").map((v) => ({ key: "format", value: v, label: FORMAT_LABELS[v] ?? v })),
    ...getList("scent").map((v) => ({ key: "scent", value: v, label: v })),
    ...getList("concern").map((v) => ({ key: "concern", value: v, label: v })),
    ...(searchParams.get("price")
      ? [{ key: "price", value: searchParams.get("price")!, label: PRICES.find((p) => p.value === searchParams.get("price"))?.label ?? "" }]
      : []),
    ...(searchParams.get("rating") ? [{ key: "rating", value: searchParams.get("rating")!, label: `${searchParams.get("rating")}★ & up` }] : []),
    ...(searchParams.get("q") ? [{ key: "q", value: searchParams.get("q")!, label: `"${searchParams.get("q")}"` }] : []),
  ];

  const removeChip = (c: { key: string; value: string }) => {
    if (["price", "rating", "q"].includes(c.key)) setSingle(c.key, null);
    else toggle(c.key, c.value);
  };

  const filterPanel = (
    <div className="space-y-1">
      <FilterGroup title="Collection">
        {collections.map((c) => (
          <CheckRow key={c.value} label={c.label} checked={getList("collection").includes(c.value)} onChange={() => toggle("collection", c.value)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Skin concern">
        {facets.concerns.map((c) => (
          <CheckRow key={c} label={c} checked={getList("concern").includes(c)} onChange={() => toggle("concern", c)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Product type">
        {facets.formats.map((f) => (
          <CheckRow key={f} label={FORMAT_LABELS[f] ?? f} checked={getList("format").includes(f)} onChange={() => toggle("format", f)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Scent">
        {facets.scents.map((s) => (
          <CheckRow key={s} label={s} checked={getList("scent").includes(s)} onChange={() => toggle("scent", s)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICES.map((p) => (
          <CheckRow key={p.value} round label={p.label} checked={searchParams.get("price") === p.value} onChange={() => setSingle("price", p.value)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Rating">
        {[4.5, 4].map((r) => (
          <CheckRow
            key={r}
            round
            label={
              <span className="flex items-center gap-2">
                <Stars rating={r} size={12} /> {r} & up
              </span>
            }
            checked={searchParams.get("rating") === String(r)}
            onChange={() => setSingle("rating", String(r))}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-xl">Filters</h2>
            {chips.length > 0 && (
              <button onClick={clearAll} className="text-xs text-ink-500 underline-offset-4 hover:underline">
                Clear all
              </button>
            )}
          </div>
          {filterPanel}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters {chips.length > 0 && `(${chips.length})`}
            </button>
            <p className={`text-sm text-ink-500 transition ${pending ? "opacity-50" : ""}`}>
              {resultCount} {resultCount === 1 ? "product" : "products"}
            </p>
          </div>
          <label className="relative flex items-center gap-2 text-sm">
            <span className="hidden text-ink-500 sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSingle("sort", e.target.value === "featured" ? null : e.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-ink-900/15 bg-cream-50 py-2 pl-4 pr-10 outline-none transition hover:border-ink-900"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4" />
          </label>
        </div>

        {chips.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={`${c.key}-${c.value}`}
                onClick={() => removeChip(c)}
                className="flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-xs text-sage-700 transition hover:bg-sage-300"
              >
                {c.label} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        <div className={`transition-opacity duration-300 ${pending ? "opacity-50" : "opacity-100"}`}>{children}</div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink-900/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute bottom-0 left-0 top-0 flex w-full max-w-sm flex-col bg-cream-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-cream-300 px-6 py-5">
            <h2 className="font-serif text-2xl">Filters</h2>
            <button onClick={() => setMobileOpen(false)} aria-label="Close filters" className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{filterPanel}</div>
          <div className="flex gap-3 border-t border-cream-300 p-6">
            <button onClick={clearAll} className="flex-1 rounded-full border border-ink-900/20 py-3 text-sm">
              Clear
            </button>
            <button onClick={() => setMobileOpen(false)} className="flex-1 rounded-full bg-ink-900 py-3 text-sm text-cream-50">
              Show {resultCount} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-cream-300 py-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-sm font-medium">
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="space-y-2.5 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  round = false,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: () => void;
  round?: boolean;
}) {
  return (
    <button onClick={onChange} className="group flex w-full items-center gap-3 text-left text-sm text-ink-700 hover:text-ink-900">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition ${round ? "rounded-full" : "rounded"} ${
          checked ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-300 group-hover:border-ink-900"
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}
