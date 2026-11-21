import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts, toSuggestion, SearchSuggestion } from "@/lib/products/search";

export interface SearchApiResponse {
  query: string;
  total: number;
  products: SearchSuggestion[];
}

/** GET /api/search?q=shirt&limit=6  -> live suggestions for the header search */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchApiResponse | { error: string }>) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const q = String(req.query.q ?? "").trim();
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "6"), 10) || 6, 1), 20);

  try {
    const { products, total } = await searchProducts(q, limit);
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ query: q, total, products: products.map(toSuggestion) });
  } catch {
    return res.status(500).json({ error: "Search failed" });
  }
}
