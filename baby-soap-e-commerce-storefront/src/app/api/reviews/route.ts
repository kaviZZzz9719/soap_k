import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureDb } from "@/lib/db-init";

export const dynamic = "force-dynamic";

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  await ensureDb();
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const productId = Number(body.productId);
  const rating = Number(body.rating);
  const author = clean(body.author, 60);
  const location = clean(body.location, 60);
  const title = clean(body.title, 100);
  const text = clean(body.body, 2000);

  if (!Number.isInteger(productId)) return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  if (author.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (title.length < 3) return NextResponse.json({ error: "Please add a short title" }, { status: 400 });
  if (text.length < 10) return NextResponse.json({ error: "Reviews need at least 10 characters" }, { status: 400 });

  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
  if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 404 });

  const [created] = await db
    .insert(reviews)
    .values({ productId, rating, author, location: location || null, title, body: text, verified: false })
    .returning();

  return NextResponse.json({ review: created }, { status: 201 });
}
