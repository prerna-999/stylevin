import { Product } from "@/types/product";
import { dummyProducts } from "@/data/dummyProducts";

export interface GetProductsParams {
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  page?: number;
  perPage?: number;
}

export interface GetProductsResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<GetProductsResult> {
  const {
    category,
    subcategory,
    search,
    sort = "newest",
    minPrice,
    maxPrice,
    colors,
    sizes,
    page = 1,
    perPage = 12,
  } = params;

  let results: Product[] = [...dummyProducts];

  if (category) {
    results = results.filter((p) => p.category === category);
  }
  if (subcategory) {
    results = results.filter((p) => p.subcategory === subcategory);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (minPrice !== undefined) {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    results = results.filter((p) => p.price <= maxPrice);
  }
  if (colors && colors.length > 0) {
    results = results.filter((p) =>
      p.colors.some((c) => colors.includes(c))
    );
  }
  if (sizes && sizes.length > 0) {
    results = results.filter((p) =>
      p.variants.some((v) => sizes.includes(v.size))
    );
  }

  switch (sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "newest":
    default:
      results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }

  const total = results.length;
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  return { products: paginated, total, page, perPage, totalPages };
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  return dummyProducts.find((p) => p.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  return dummyProducts
    .filter(
      (p) => p.id !== product.id && p.category === product.category
    )
    .slice(0, limit);
}