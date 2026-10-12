import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-8xl font-light text-blush-300">404</p>
      <h1 className="mt-4 font-serif text-3xl">This page floated away like a bubble</h1>
      <p className="mt-3 text-ink-500">Let&apos;s get you back to something soft and sudsy.</p>
      <Link href="/shop" className="mt-8 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-cream-50">
        Shop all soaps
      </Link>
    </div>
  );
}
