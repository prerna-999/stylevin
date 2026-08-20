import { qikinkRequest } from "./client";

/**
 * Shape of a raw Qikink catalog item.
 * PLACEHOLDER — replace field names once you see the real response
 * from your Postman collection's product/catalog request.
 */
export interface QikinkRawProduct {
  style_code: string;
  product_name: string;
  category?: string;
  base_price?: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  [key: string]: unknown;
}

/**
 * Fetches Qikink's product/style catalog.
 *
 * TODO: replace "/api/products" below with the exact path from your
 * dashboard's Custom API / Postman collection. Common alternates to
 * check for: /api/product/list, /api/style/list, /api/catalog.
 */
export async function fetchQikinkCatalog(): Promise<QikinkRawProduct[]> {
  const data = await qikinkRequest<{ products?: QikinkRawProduct[] } | QikinkRawProduct[]>(
    "/api/products"
  );

  // Some APIs wrap the array in a `products` key, others return it raw —
  // handle both until you confirm the real shape.
  if (Array.isArray(data)) return data;
  return data.products ?? [];
}