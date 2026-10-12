"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className={`mt-5 flex items-center gap-2 text-sm ${dark ? "text-sage-300" : "text-sage-700"}`}>
        <Check className="h-4 w-4" /> Welcome! Use code <strong>WELCOME10</strong> at checkout.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (/^\S+@\S+\.\S+$/.test(email)) setDone(true);
      }}
      className={`mt-5 flex items-center rounded-full border p-1 pl-5 ${
        dark ? "border-white/20 bg-white/5" : "border-ink-900/15 bg-white"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Email address"
        className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
          dark ? "text-cream-50 placeholder:text-cream-300/60" : "placeholder:text-ink-300"
        }`}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
          dark ? "bg-cream-50 text-ink-900 hover:bg-white" : "bg-ink-900 text-cream-50 hover:bg-ink-700"
        }`}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
