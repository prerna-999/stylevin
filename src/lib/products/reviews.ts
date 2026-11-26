import { Product } from "@/types/product";
import { Review, ReviewSummary } from "@/types/review";
import { REVIEW_AUTHORS, REVIEW_TEMPLATES } from "@/data/dummyReviews";

type Star = 1 | 2 | 3 | 4 | 5;
const STARS: Star[] = [5, 4, 3, 2, 1];

/* ---------- summary helpers ---------- */

/** Spread `total` reviews over 1–5 stars so the average lands near `average`. */
export function estimateBreakdown(average: number, total: number): ReviewSummary["breakdown"] {
  const empty = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (total <= 0) return empty;

  const weights = STARS.map((s) => Math.exp(-((s - average) ** 2) / 1.1) + (s === 5 ? 0.15 : 0));
  const sum = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.floor((w / sum) * total));
  let left = total - counts.reduce((a, b) => a + b, 0);
  // hand out the rounding remainder to the stars closest to the average
  const order = STARS.map((s, i) => ({ i, d: Math.abs(s - average) })).sort((a, b) => a.d - b.d);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) counts[order[k].i] += 1;

  const out = { ...empty };
  STARS.forEach((s, i) => (out[s] = counts[i]));
  return out;
}

/** Recalculate the summary after merging extra reviews (e.g. the shopper's own). */
export function mergeSummary(base: ReviewSummary, extra: Review[]): ReviewSummary {
  if (extra.length === 0) return base;
  const breakdown = { ...base.breakdown };
  extra.forEach((r) => (breakdown[r.rating as Star] += 1));
  const total = base.total + extra.length;
  const average = (base.average * base.total + extra.reduce((n, r) => n + r.rating, 0)) / total;
  return { average: Math.round(average * 10) / 10, total, breakdown };
}

/* ---------- data source ---------- */

// small deterministic PRNG so the same product always gets the same placeholder reviews
const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

/**
 * Reviews for one product.
 * TODO: replace the body with a call to your reviews API — keep the return shape.
 */
export async function getProductReviews(
  product: Product,
  limit = 8
): Promise<{ reviews: Review[]; summary: ReviewSummary }> {
  const average = product.rating ?? 0;
  const total = product.reviewCount ?? 0;
  const summary: ReviewSummary = { average, total, breakdown: estimateBreakdown(average, total) };

  if (total === 0) return { reviews: [], summary };

  const rand = seeded(product.id * 97 + 13);
  const sizes = product.variants.map((v) => v.size);

  // pick templates in proportion to the breakdown, highest ratings first
  const pool: Review[] = [];
  const count = Math.min(limit, total);
  const wanted = STARS.map((s) => ({ s, n: Math.round((summary.breakdown[s] / total) * count) }));

  wanted.forEach(({ s, n }) => {
    const options = REVIEW_TEMPLATES.filter((t) => t.rating === s);
    for (let k = 0; k < n && pool.length < count && options.length; k++) {
      const t = options[Math.floor(rand() * options.length)];
      const daysAgo = 3 + Math.floor(rand() * 120);
      const date = new Date(Date.UTC(2026, 10, 15) - daysAgo * 86400000);
      pool.push({
        id: `${product.id}-${pool.length}`,
        productId: product.id,
        author: REVIEW_AUTHORS[Math.floor(rand() * REVIEW_AUTHORS.length)],
        rating: s,
        title: t.title,
        comment: t.comment,
        date: date.toISOString().slice(0, 10),
        size: sizes[Math.floor(rand() * sizes.length)],
        verified: rand() > 0.2,
        helpful: Math.floor(rand() * 40),
      });
    }
  });

  pool.sort((a, b) => b.date.localeCompare(a.date));
  return { reviews: pool, summary };
}
