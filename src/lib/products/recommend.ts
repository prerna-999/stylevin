import { Product } from "@/types/product";

/**
 * Scores every candidate against the product being viewed and the
 * shopper's browsing history (recent views count more), then returns the best.
 *
 * Signals: same subcategory > same category > similar price > shared colour,
 * with a small boost for well-rated products.
 */
export function recommendProducts(
  current: Product,
  candidates: Product[],
  historyIds: number[],
  limit = 5
): Product[] {
  const byId = new Map(candidates.map((p) => [p.id, p]));
  const viewed = historyIds.map((id) => byId.get(id)).filter(Boolean) as Product[];

  // the current product is the strongest signal, then history by recency
  const signals: { p: Product; w: number }[] = [
    { p: current, w: 2 },
    ...viewed.slice(0, 8).map((p, i) => ({ p, w: 1 / (i + 1) })),
  ];

  const similarity = (a: Product, b: Product) => {
    let s = 0;
    if (a.category === b.category) s += 2;
    if (a.category === b.category && a.subcategory === b.subcategory) s += 3;
    const ratio = Math.min(a.price, b.price) / Math.max(a.price, b.price);
    if (ratio >= 0.7) s += 1;
    if (a.colors.some((c) => b.colors.includes(c))) s += 0.5;
    return s;
  };

  const recentlyViewed = new Set(historyIds.slice(0, 3));

  return candidates
    .filter((p) => p.id !== current.id && p.variants.some((v) => v.stock > 0))
    .map((p) => {
      let score = signals.reduce((sum, { p: sig, w }) => sum + similarity(sig, p) * w, 0);
      score += ((p.rating ?? 0) / 5) * 0.5;
      // don't just echo the last few things they looked at — that's what "Recently Viewed" is for
      if (recentlyViewed.has(p.id)) score *= 0.6;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (b.p.reviewCount ?? 0) - (a.p.reviewCount ?? 0))
    .slice(0, limit)
    .map(({ p }) => p);
}
