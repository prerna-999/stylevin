import { authHeaders, AuthUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const STAGES = [
  { key: "placed", label: "Order Placed", desc: "We've received your order." },
  { key: "confirmed", label: "Order Confirmed", desc: "The store has confirmed your order." },
  { key: "processing", label: "Processing", desc: "Your order is being prepared for shipment." },
  { key: "shipped", label: "Shipped", desc: "Your order has left our warehouse." },
  { key: "out_for_delivery", label: "Out for Delivery", desc: "Your order is on its way to you." },
  { key: "delivered", label: "Delivered", desc: "Your order has been delivered." },
] as const;

export type OrderAddress = {
  firstName?: string; lastName?: string; address1?: string; address2?: string;
  city?: string; state?: string; pin?: string; country?: string; phone?: string; email?: string;
};

export interface TrackedItem {
  name: string; image?: string; slug?: string; size?: string; color?: string;
  colorName?: string; qty: number; price: number;
}

export interface TrackedOrder {
  id: string;
  placedAt?: string;
  items: TrackedItem[];
  total: number;
  paymentMethod: string;
  address: OrderAddress;
  estimatedDelivery?: string;
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  /** index into STAGES of the current stage, or -1 when cancelled / returned */
  stage: number;
  closed?: "cancelled" | "returned";
  /** ISO date-time at which each stage was reached (when the backend provides it) */
  stageTimes: (string | undefined)[];
}

/* backend status text -> stage index */
const STATUS_MAP: Record<string, number> = {
  placed: 0, pending: 0, created: 0, new: 0, paid: 0,
  confirmed: 1, accepted: 1,
  processing: 2, packed: 2, in_production: 2, printing: 2, ready_to_ship: 2,
  shipped: 3, dispatched: 3, in_transit: 3,
  out_for_delivery: 4,
  delivered: 5, completed: 5,
};

const norm = (s: unknown) => String(s ?? "").toLowerCase().trim().replace(/[\s-]+/g, "_");

function stageOf(status: unknown): { stage: number; closed?: "cancelled" | "returned" } {
  const s = norm(status);
  if (s === "cancelled" || s === "canceled" || s === "failed") return { stage: -1, closed: "cancelled" };
  if (s === "returned" || s === "rto" || s === "refunded") return { stage: -1, closed: "returned" };
  return { stage: STATUS_MAP[s] ?? 0 };
}

const unwrap = (d: any) => d?.data ?? d?.order ?? d;
const unwrapList = (d: any): any[] =>
  Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : Array.isArray(d?.orders) ? d.orders : [];

/** tolerant mapping of whatever the backend returns into one shape */
export function normalizeOrder(o: any): TrackedOrder {
  const { stage, closed } = stageOf(o.status ?? o.orderStatus);
  const stageTimes: (string | undefined)[] = STAGES.map(() => undefined);
  stageTimes[0] = o.createdAt ?? o.placedAt ?? o.orderDate;

  const history: any[] = o.statusHistory ?? o.timeline ?? o.history ?? o.tracking?.events ?? [];
  if (Array.isArray(history)) {
    history.forEach((h) => {
      const idx = stageOf(h.status ?? h.stage ?? h.key).stage;
      const at = h.at ?? h.createdAt ?? h.date ?? h.timestamp ?? h.time;
      if (idx >= 0 && at && !stageTimes[idx]) stageTimes[idx] = at;
    });
  }

  const addr = o.shippingAddress ?? o.address ?? {};
  return {
    id: String(o.orderNumber ?? o.orderId ?? o.id ?? ""),
    placedAt: stageTimes[0],
    items: (o.items ?? o.lineItems ?? []).map((i: any) => ({
      name: i.name ?? i.productName ?? "Item",
      image: i.image ?? i.imageUrl,
      slug: i.slug,
      size: i.size,
      color: i.color,
      colorName: i.colorName,
      qty: Number(i.quantity ?? i.qty ?? 1),
      price: Number(i.price ?? 0),
    })),
    total: Number(o.total ?? o.totalAmount ?? o.amount ?? 0),
    paymentMethod: String(o.paymentMethod ?? o.gateway ?? ""),
    address: {
      firstName: addr.firstName, lastName: addr.lastName,
      address1: addr.address1 ?? addr.street, address2: addr.address2,
      city: addr.city, state: addr.state ?? addr.province,
      pin: addr.pin ?? addr.zip ?? addr.postalCode, country: addr.country,
      phone: addr.phone, email: addr.email,
    },
    estimatedDelivery: o.estimatedDelivery ?? o.estimatedDeliveryDate ?? o.eta,
    trackingNumber: o.trackingNumber ?? o.awb ?? o.tracking?.number,
    courier: o.courier ?? o.courierName ?? o.deliveryPartner ?? o.tracking?.courier,
    trackingUrl: o.trackingUrl ?? o.tracking?.url,
    stage,
    closed,
    stageTimes,
  };
}

export class AuthExpiredError extends Error {}

/** all orders of the logged-in customer (the backend scopes them by the token) */
export async function fetchMyOrders(user: AuthUser): Promise<TrackedOrder[]> {
  const res = await fetch(`${API_URL}/orders`, { headers: { ...authHeaders() }, cache: "no-store" });
  if (res.status === 401 || res.status === 403) throw new AuthExpiredError();
  if (!res.ok) throw new Error("We couldn't load your orders right now.");
  const raw = unwrapList(await res.json());
  return raw
    // belt and braces: never show an order that names a different customer
    .filter((o) => {
      const owner = o.userId ?? o.user?.id ?? o.customerId ?? o.customer?.id;
      return owner == null || String(owner) === String(user.id);
    })
    .map(normalizeOrder)
    .filter((o) => o.id)
    .sort((a, b) => +new Date(b.placedAt ?? 0) - +new Date(a.placedAt ?? 0)); // latest first
}

export const isFinished = (o: TrackedOrder) => o.stage === 5 || !!o.closed;

export const paymentLabel = (m: string) => {
  const s = norm(m);
  if (s === "cod") return "Cash on Delivery";
  if (s === "online" || s === "prepaid") return "Paid Online";
  return m || "—";
};

export const fmtDate = (iso?: string) =>
  iso && !isNaN(+new Date(iso))
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export const fmtDateTime = (iso?: string) =>
  iso && !isNaN(+new Date(iso))
    ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : "";
