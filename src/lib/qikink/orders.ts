import { qikinkRequest } from "./client";

export interface QikinkDesign {
  design_code: string;
  width_inches?: string;
  height_inches?: string;
  placement_sku: string; // e.g. "fr" (front), "bk" (back)
  design_link?: string;
  mockup_link?: string;
  
}

export interface QikinkLineItem {
  search_from_my_products: 0 | 1; // 0 = use sku directly, 1 = search your saved products
  quantity: string;
  price: string;
  sku: string; // Qikink product/style SKU, e.g. "MVnHs-Wh-S"
  print_type_id: string; // required — e.g. "1" for DTG. Confirm valid values against your Qikink dashboard/docs.
  designs: QikinkDesign[];
}

export interface QikinkShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  phone: string;
  email: string;
  city: string;
  zip: string;
  province: string;
  country_code: string; 
  
}

export interface CreateQikinkOrderInput {
  order_number: string; // your own unique order id/reference — max 15 chars
  qikink_shipping: "0" | "1"; // "1" = let Qikink handle shipping
  gateway: "COD" | "PREPAID";
  total_order_value: string;
  line_items: QikinkLineItem[];
  shipping_address: QikinkShippingAddress;
}

export interface QikinkOrderResponse {
  order_id?: string;
  message?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Creates an order on Qikink for print-on-demand fulfilment.
 * Call this after your own checkout/payment flow completes —
 * this is what actually sends the design + shipping info to Qikink
 * for printing and dispatch.
 */
export async function createQikinkOrder(
  input: CreateQikinkOrderInput
): Promise<QikinkOrderResponse> {
  return qikinkRequest<QikinkOrderResponse>("/api/order/create", {
    method: "POST",
    body: input,
  });
}