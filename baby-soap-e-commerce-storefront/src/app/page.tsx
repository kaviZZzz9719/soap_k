import Link from "next/link";
import { ArrowRight, Droplets, Feather, HeartHandshake, Leaf, Stethoscope } from "lucide-react";
import { getCollections, getFeaturedProducts, getLatestReviews, getStoreStats } from "@/lib/queries";
import { toCard } from "@/lib/card";
import { ProductCard } from "@/components/product-card";
import { Reveal, Stars } from "@/components/ui";
import { NewsletterForm } from "@/components/newsletter-form";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [collections, featured, latestReviews, stats] = await Promise.all([
    getCollections(),
    getFeaturedProducts(4),
    getLatestReviews(3),
    getStoreStats(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.jpg" alt="" className="h-full w-full object-cover object-[70%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream-50 via-cream-50/80 to-transparent md:via-cream-50/60" />
        </div>
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:min-h-[86vh] lg:px-8">
          <div className="max-w-xl">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-sage-700">
              Handmade baby soap · Small batch
            </p>
            <h1 className="mt-6 animate-fade-up font-serif text-5xl font-light leading-[1.05] tracking-tight [animation-delay:120ms] sm:text-6xl lg:text-7xl">
              The gentlest
              <br />
              <span className="italic text-blush-500">first</span> bath.
            </h1>
            <p className="mt-6 max-w-md animate-fade-up text-lg leading-relaxed text-ink-700 [animation-delay:240ms]">
              Slow-cured soaps with goat milk, colloidal oat and calming botanicals, made for the softest,
              newest skin in your world.
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:360ms]">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?collection=gift-sets"
                className="rounded-full border border-ink-900/20 bg-cream-50/60 px-8 py-4 text-sm font-medium backdrop-blur transition hover:border-ink-900"
              >
                Explore gifts
              </Link>
            </div>
            <div className="mt-12 flex animate-fade-up items-center gap-4 [animation-delay:480ms]">
              <div className="flex -space-x-3">
                {["/images/life-feet.jpg", "/images/life-towel.jpg", "/images/life-skincare.jpg"].map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-cream-50 object-cover" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <Stars rating={stats.avgRating} />
                  <span className="font-medium">{stats.avgRating.toFixed(1)}</span>
                </div>
                <p className="text-ink-500">Loved by 12,000+ families · {stats.reviewCount} verified reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-cream-300 bg-cream-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Stethoscope, title: "Pediatrician tested", text: "Safe from day one" },
            { icon: Droplets, title: "pH balanced", text: "Never stripping" },
            { icon: Leaf, title: "Clean botanicals", text: "No sulfates or dyes" },
            { icon: Feather, title: "Plastic-free bars", text: "Compostable wraps" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-50 text-sage-700">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-ink-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-700">Featured collections</p>
            <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
              Made for every <span className="italic">little</span> moment
            </h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-sm font-medium">
            View all products <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link
                href={`/shop?collection=${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl"
                style={{ backgroundColor: c.accent }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">{c.tagline}</p>
                  <h3 className="mt-1 font-serif text-2xl">{c.name}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm opacity-90">
                    {c.productCount} products
                    <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-cream-100 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-700">Most loved</p>
            <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">Bath-time bestsellers</h2>
            <p className="mx-auto mt-4 max-w-lg text-ink-500">
              The bars and washes parents reorder again and again, chosen by thousands of tiny, very discerning
              customers.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={toCard(p)} priority={i < 2} />
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/shop?sort=bestselling"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900 px-8 py-3.5 text-sm font-medium transition hover:bg-ink-900 hover:text-cream-50"
            >
              Shop all bestsellers
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/life-bath.jpg" alt="A gentle bath time moment" className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]" />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden w-48 animate-float overflow-hidden rounded-2xl border-4 border-cream-50 shadow-xl sm:block lg:-right-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/p-oat-comfort.jpg" alt="" className="aspect-square w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage-700">Our promise</p>
          <h2 className="mt-3 font-serif text-4xl font-light leading-tight sm:text-5xl">
            Made with the care you&apos;d give them <span className="italic text-blush-500">yourself</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-700">
            kAvI began at a kitchen table, with a new mother searching for a soap simple enough for her
            daughter&apos;s eczema-prone skin. Today every bar is still poured, cut and cured by hand for eight
            weeks, then tested by pediatric dermatologists before it ever reaches a nursery.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "8-week slow cure", text: "For the mildest, longest-lasting bars." },
              { title: "≤ 12 ingredients", text: "Every one is listed, explained and needed." },
              { title: "Fragrance-free options", text: "Most of our range has zero added scent." },
              { title: "30-day happiness", text: "Not a perfect fit? We'll make it right." },
            ].map((f) => (
              <div key={f.title} className="border-l-2 border-blush-300 pl-4">
                <p className="font-serif text-lg">{f.title}</p>
                <p className="mt-1 text-sm text-ink-500">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-ink-500">
            <HeartHandshake className="h-5 w-5 text-blush-500" />
            1% of every order supports neonatal care programs.
          </div>
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="relative overflow-hidden bg-sage-100 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <Stars rating={5} size={18} className="justify-center" />
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">From our kAvI families</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {latestReviews.map(({ review, productName, productSlug }, i) => (
              <Reveal key={review.id} delay={i * 120}>
                <figure className="flex h-full flex-col rounded-3xl bg-cream-50 p-8 shadow-sm">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-5 flex-1">
                    <p className="font-serif text-xl leading-snug">&ldquo;{review.title}&rdquo;</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{review.body}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between border-t border-cream-300 pt-5 text-sm">
                    <span>
                      <span className="font-medium">{review.author}</span>
                      <span className="block text-xs text-ink-500">{review.location}</span>
                    </span>
                    <Link href={`/products/${productSlug}`} className="text-right text-xs text-sage-700 hover:underline">
                      {productName}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GIFT BANNER */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grain relative grid overflow-hidden rounded-[2rem] bg-blush-100 md:grid-cols-2">
            <div className="relative z-10 flex flex-col justify-center p-10 sm:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blush-500">The perfect shower gift</p>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight sm:text-5xl">
                Welcome Baby
                <br />
                <span className="italic">Gift Box</span>
              </h2>
              <p className="mt-5 max-w-sm text-ink-700">
                A keepsake box with our favorite bars, foaming wash, organic muslin cloth and a beechwood dish.
                Hand-tied, with a handwritten note.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/products/welcome-baby-gift-box"
                  className="rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-cream-50 transition hover:bg-ink-700"
                >
                  Shop the gift box
                </Link>
                <span className="text-sm text-ink-500">
                  <span className="font-medium text-ink-900">$58</span> <span className="line-through">$68</span>
                </span>
              </div>
            </div>
            <div className="relative min-h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/p-giftbox.jpg" alt="Welcome Baby Gift Box" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-2xl px-4 pt-24 text-center sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl font-light">Bath-time notes, delivered</h2>
          <p className="mt-3 text-ink-500">
            Gentle skincare tips, new arrivals, and <strong className="text-ink-900">10% off</strong> your first order.
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
