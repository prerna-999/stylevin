import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/products/getProducts";
import { CATEGORIES } from "@/lib/categories";
import { getColorName } from "@/lib/colors";

export const STORE_BRAND = "Stylevin";

export interface SearchSuggestion {
  id: number;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  image?: string;
}

const words = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);

/** catalog text: "T-Shirt" stays ONE word ("tshirt") so a search for "shirt" doesn't pull in t-shirts */
const indexWords = (s: string) => words(s.toLowerCase().replace(/([a-z0-9])-(?=[a-z0-9])/g, "$1"));

/** query text: "t shirt" -> ["tshirt"] (a lone letter joins the word after it) */
const queryWords = (s: string) => {
  const w = words(s);
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    if (w[i].length === 1 && i + 1 < w.length) { out.push(w[i] + w[i + 1]); i++; }
    else out.push(w[i]);
  }
  return out;
};

/** "T-Shirts" -> "tshirts"; lets "tshirt" and "t shirt" both find it */
const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** "shirts" -> "shirt", "dresses" -> "dress": cheap plural handling */
const singular = (w: string) =>
  w.length > 3 && w.endsWith("es") && /(ss|sh|ch|x)es$/.test(w) ? w.slice(0, -2)
  : w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w;

const labelFor = (slug: string, sub?: string) => {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const subLabel = cat?.subcategories.find((s) => s.slug === sub)?.label ?? sub ?? "";
  return { cat: cat?.label ?? slug, sub: subLabel };
};

interface Indexed {
  product: Product;
  name: string[];
  nameCompact: string;
  category: string[];
  brand: string[];
  other: string[]; // code, colours, description
  otherCompact: string;
}

const index = (p: Product): Indexed => {
  const l = labelFor(p.category, p.subcategory);
  const colours = p.colors.map((c) => getColorName(c) ?? "").join(" ");
  return {
    product: p,
    name: indexWords(p.name),
    nameCompact: compact(p.name),
    category: indexWords(`${l.cat} ${l.sub} ${p.category} ${p.subcategory}`),
    brand: words(p.brand ?? STORE_BRAND),
    other: indexWords(`${p.code ?? ""} ${colours} ${p.description}`),
    otherCompact: compact(`${p.code ?? ""} ${colours} ${p.description}`),
  };
};

const hit = (list: string[], tok: string) =>
  tok.length < 2
    ? list.includes(tok) // a lone letter must be a whole word, not a prefix of everything
    : list.some((w) => w.startsWith(tok) || singular(w).startsWith(singular(tok)));

/** score one product for the query; 0 = not a match. Every typed word must match somewhere. */
function score(ix: Indexed, tokens: string[], whole: string): number {
  let total = 0;
  for (const tok of tokens) {
    let s = 0;
    if (hit(ix.name, tok)) s = 10;
    else if (hit(ix.category, tok)) s = 7;
    else if (hit(ix.brand, tok)) s = 6;
    else if (hit(ix.other, tok)) s = 3;
    if (s === 0) return 0;
    total += s;
  }
  if (ix.nameCompact.startsWith(compact(whole))) total += 8;
  else if (ix.nameCompact.includes(compact(whole))) total += 4;
  return total;
}

/**
 * Searches the catalog by name, category / subcategory, brand and keywords
 * (colour, product code, description). Best matches first.
 */
export async function searchProducts(query: string, limit = 100): Promise<{ products: Product[]; total: number }> {
  const q = query.trim().slice(0, 80);
  const tokens = queryWords(q);
  if (tokens.length === 0) return { products: [], total: 0 };

  const catalog = await getAllProducts();
  const ranked = catalog
    .map((p) => ({ p, s: score(index(p), tokens, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || (b.p.reviewCount ?? 0) - (a.p.reviewCount ?? 0));

  return { products: ranked.slice(0, limit).map((r) => r.p), total: ranked.length };
}

export const toSuggestion = (p: Product): SearchSuggestion => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: labelFor(p.category, p.subcategory).cat,
  subcategory: labelFor(p.category, p.subcategory).sub,
  price: p.price,
  mrp: p.mrp,
  image: p.images?.[0],
});
