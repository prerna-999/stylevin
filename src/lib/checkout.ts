import { authHeaders, AuthUser } from "@/lib/auth";
import type { CartItem } from "@/context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ------------------------------------------------------------------ */
/* constants                                                           */
/* ------------------------------------------------------------------ */

export const FREE_SHIPPING_FROM = 999;

export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Singapore",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // union territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export type ShippingMethodId = "standard" | "express";
export type PaymentMethodId = "online" | "cod";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  eta: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "standard", label: "Standard Delivery", eta: "Metro 3–5 business days · Other 5–7 business days" },
  { id: "express", label: "Express Delivery", eta: "2–3 business days" },
];

export const PAYMENT_METHODS: { id: PaymentMethodId; label: string; desc: string }[] = [
  { id: "online", label: "UPI", desc: "Pay using any UPI app (Google Pay, PhonePe, Paytm, BHIM)" },
  { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay when your order arrives" },
];

/** shipping charge: standard is free on prepaid orders >= ₹999, flat ₹79 otherwise; express is ₹149 */
export function shippingCharge(
  method: ShippingMethodId,
  payment: PaymentMethodId,
  subtotal: number
): number {
  if (method === "express") return 149;
  return payment === "online" && subtotal >= FREE_SHIPPING_FROM ? 0 : 79;
}

/* ------------------------------------------------------------------ */
/* address                                                             */
/* ------------------------------------------------------------------ */

export interface Address {
  id?: string | number;
  country: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  isDefault?: boolean;
}

export const emptyAddress = (user?: AuthUser | null): Address => {
  const parts = (user?.name || "").trim().split(/\s+/).filter(Boolean);
  return {
    country: "India",
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    email: user?.email || "",
  };
};

export type AddressErrors = Partial<Record<keyof Address, string>>;

export function validateAddress(a: Address): AddressErrors {
  const e: AddressErrors = {};
  if (!a.country) e.country = "Select a country";
  if (!a.firstName.trim()) e.firstName = "Enter first name";
  if (!a.lastName.trim()) e.lastName = "Enter last name";
  if (!a.address1.trim()) e.address1 = "Enter your street address";
  if (!a.city.trim()) e.city = "Enter city";
  if (!a.state) e.state = "Select a state";
  if (!/^[1-9][0-9]{5}$/.test(a.pin.trim())) e.pin = "Enter a valid 6-digit PIN code";
  if (!/^[6-9][0-9]{9}$/.test(a.phone.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "")))
    e.phone = "Enter a valid 10-digit mobile number";
  if (!/^\S+@\S+\.\S+$/.test(a.email.trim())) e.email = "Enter a valid email address";
  return e;
}

const sameAddress = (a: Address, b: Address) =>
  (["country", "firstName", "lastName", "address1", "address2", "city", "state", "pin", "phone", "email"] as const)
    .every((k) => (a[k] || "").toString().trim() === (b[k] || "").toString().trim());
export { sameAddress };

/* ------------------------------------------------------------------ */
/* address storage: backend first, per-account localStorage fallback   */
/* ------------------------------------------------------------------ */

const localKey = (user: AuthUser) => `stylevin_addresses_${user.id}`;

const readLocal = (user: AuthUser): Address[] => {
  try {
    const raw = localStorage.getItem(localKey(user));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocal = (user: AuthUser, list: Address[]) => {
  try {
    localStorage.setItem(localKey(user), JSON.stringify(list));
  } catch {
    /* storage blocked */
  }
};

/** the backend may answer with an array or { data: [...] } / { addresses: [...] } */
const unwrapList = (data: any): Address[] =>
  Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.addresses) ? data.addresses : [];

export async function fetchAddresses(user: AuthUser): Promise<Address[]> {
  try {
    const res = await fetch(`${API_URL}/addresses`, { headers: { ...authHeaders() } });
    if (res.ok) return unwrapList(await res.json());
  } catch {
    /* fall through to local copy */
  }
  return readLocal(user);
}

/** create (no id) or update (id) an address; the newest saved address becomes the default */
export async function saveAddress(user: AuthUser, addr: Address): Promise<Address> {
  const body = { ...addr, isDefault: true };
  try {
    const res = await fetch(
      addr.id != null ? `${API_URL}/addresses/${addr.id}` : `${API_URL}/addresses`,
      {
        method: addr.id != null ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      }
    );
    if (res.ok) {
      const saved = await res.json().catch(() => null);
      return { ...body, ...(saved?.data ?? saved ?? {}) } as Address;
    }
  } catch {
    /* fall through to local copy */
  }
  // backend unavailable -> keep the address on this device for this account
  const list: Address[] = readLocal(user).map((a) => ({ ...a, isDefault: false }));
  const id = addr.id ?? `local-${Date.now()}`;
  const next = { ...body, id } as Address;
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  writeLocal(user, list);
  return next;
}

/* ------------------------------------------------------------------ */
/* order                                                               */
/* ------------------------------------------------------------------ */

export interface OrderTotals {
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
}

export interface OrderSnapshot {
  orderId: string;
  placedAt: string;
  items: CartItem[];
  address: Address;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  totals: OrderTotals;
}

export interface CreateOrderResult {
  orderId: string;
  /** set by the backend for online payments: send the customer here to pay */
  paymentUrl?: string;
}

export async function createOrder(payload: {
  items: CartItem[];
  address: Address;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  totals: OrderTotals;
}): Promise<CreateOrderResult> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      items: payload.items.map((i) => ({
        productId: i.id, slug: i.slug, name: i.name, size: i.size, color: i.color,
        colorName: i.colorName, quantity: i.qty, price: i.price, mrp: i.mrp, image: i.image,
      })),
      shippingAddress: payload.address,
      shippingMethod: payload.shippingMethod,
      paymentMethod: payload.paymentMethod,
      // fields the order API validates (COD | ONLINE and flat ship* address)
      ...({
        paymentMethod: payload.paymentMethod === "cod" ? "COD" : "ONLINE",
        shipName: `${payload.address.firstName} ${payload.address.lastName}`.trim(),
        shipLine1: payload.address.address1,
        shipLine2: payload.address.address2 || undefined,
        shipCity: payload.address.city,
        shipState: payload.address.state,
        shipPincode: payload.address.pin,
        shipPhone: payload.address.phone.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""),
        shipEmail: payload.address.email,
      }),
      subtotal: payload.totals.subtotal,
      discount: payload.totals.savings,
      shippingCharge: payload.totals.shipping,
      total: payload.totals.total,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(", ") : data.message || "Could not place your order. Please try again."
    );
  }
  const o = data?.data ?? data?.order ?? data;
  const orderId = String(o.orderNumber ?? o.orderId ?? o.id ?? "");
  if (!orderId) throw new Error("Order was created but no order number was returned.");
  return { orderId, paymentUrl: o.paymentUrl ?? data.paymentUrl };
}

export const LAST_ORDER_KEY = "stylevin_last_order";

export const saveOrderSnapshot = (snap: OrderSnapshot) => {
  try { sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(snap)); } catch { /* ignore */ }
};

export const readOrderSnapshot = (): OrderSnapshot | null => {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
