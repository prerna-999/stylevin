import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiPackage, FiArrowLeft, FiCheck, FiRefreshCw } from "react-icons/fi";
import { useAuth, clearSession } from "@/lib/auth";
import {
  AuthExpiredError, STAGES, TrackedOrder, fetchMyOrders, fmtDate, fmtDateTime,
  isFinished, paymentLabel,
} from "@/lib/orders";

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const POLL_MS = 60_000;

/* ---------------- timeline ---------------- */
const Timeline: React.FC<{ order: TrackedOrder }> = ({ order }) => {
  if (order.closed) {
    return (
      <div className="to-closed" role="status">
        This order was {order.closed}.
        {order.closed === "cancelled" && " If you were charged, the amount will be refunded to your original payment method."}
      </div>
    );
  }
  return (
    <ol className="to-timeline" aria-label="Order tracking">
      {STAGES.map((s, i) => {
        const done = i < order.stage || (i === order.stage && order.stage === 5);
        const current = i === order.stage && order.stage !== 5;
        const at = order.stageTimes[i];
        return (
          <li key={s.key} className={`to-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
              aria-current={current ? "step" : undefined}>
            <span className="to-step__dot">{done ? <FiCheck /> : i + 1}</span>
            <div className="to-step__text">
              <b>{s.label}</b>
              {(done || current) && at ? <small>{fmtDateTime(at)}</small> : null}
              {current && <small className="to-step__now">Current status</small>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const statusText = (o: TrackedOrder) =>
  o.closed ? (o.closed === "cancelled" ? "Cancelled" : "Returned") : STAGES[o.stage].label;

const Badge: React.FC<{ order: TrackedOrder }> = ({ order }) => (
  <span className={`to-badge ${order.closed ? "is-bad" : order.stage === 5 ? "is-good" : ""}`}>{statusText(order)}</span>
);

const Thumb: React.FC<{ src?: string; alt: string }> = ({ src, alt }) =>
  // eslint-disable-next-line @next/next/no-img-element
  src ? <img src={src} alt={alt} className="to-thumb" loading="lazy" /> : <span className="to-thumb to-thumb--empty"><FiPackage /></span>;

/* ---------------- details ---------------- */
const Details: React.FC<{ order: TrackedOrder }> = ({ order }) => {
  const a = order.address;
  return (
    <div className="to-detail">
      <div className="to-detail__head">
        <div>
          <h2>Order #{order.id}</h2>
          <p>Placed on {fmtDate(order.placedAt)}</p>
        </div>
        <Badge order={order} />
      </div>

      <Timeline order={order} />

      <div className="to-grid">
        <div className="to-box">
          <h3>Delivery</h3>
          <dl>
            <div><dt>Estimated delivery</dt><dd>{order.closed ? "—" : fmtDate(order.estimatedDelivery)}</dd></div>
            <div><dt>Courier</dt><dd>{order.courier || "Will be updated once shipped"}</dd></div>
            <div>
              <dt>Tracking number</dt>
              <dd>
                {order.trackingNumber
                  ? order.trackingUrl
                    ? <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">{order.trackingNumber}</a>
                    : order.trackingNumber
                  : "Will be updated once shipped"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="to-box">
          <h3>Shipping address</h3>
          <p className="to-addr">
            <b>{a.firstName} {a.lastName}</b><br />
            {a.address1}{a.address2 ? `, ${a.address2}` : ""}<br />
            {a.city}, {a.state} {a.pin}<br />
            {a.country}{a.phone ? ` · ${a.phone}` : ""}
          </p>
        </div>
        <div className="to-box">
          <h3>Payment</h3>
          <dl>
            <div><dt>Method</dt><dd>{paymentLabel(order.paymentMethod)}</dd></div>
            <div><dt>Total amount</dt><dd><b>{rupee(order.total)}</b></dd></div>
          </dl>
        </div>
      </div>

      <h3 className="to-items-title">Items ({order.items.reduce((n, i) => n + i.qty, 0)})</h3>
      <ul className="to-items">
        {order.items.map((i, idx) => (
          <li key={idx} className="to-item">
            <Thumb src={i.image} alt={i.name} />
            <div className="to-item__info">
              <b>{i.slug ? <Link href={`/product/${i.slug}`}>{i.name}</Link> : i.name}</b>
              <small>
                {[i.size && `Size: ${i.size}`, (i.colorName || i.color) && `Color: ${i.colorName || i.color}`, `Qty: ${i.qty}`]
                  .filter(Boolean).join(" · ")}
              </small>
            </div>
            <span className="to-item__price">{rupee(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------------- page ---------------- */
const TrackOrder: React.FC = () => {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // not logged in -> login/signup, then straight back here
  useEffect(() => {
    if (ready && !user) router.replace("/profile?redirect=" + encodeURIComponent("/track-order"));
  }, [ready, user, router]);

  const load = useCallback(async (silent = false) => {
    if (!user) return;
    if (silent) setRefreshing(true);
    try {
      setOrders(await fetchMyOrders(user));
      setError("");
    } catch (e: any) {
      if (e instanceof AuthExpiredError) { clearSession(); return; }
      setError(e?.message || "We couldn't load your orders right now.");
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { setOrders(null); load(); }, [load]);

  // keep statuses live: poll while any order is still in progress, and refresh when the tab regains focus
  useEffect(() => {
    if (!user) return;
    const active = orders?.some((o) => !isFinished(o));
    const timer = active ? window.setInterval(() => load(true), POLL_MS) : undefined;
    const onFocus = () => load(true);
    const onVisible = () => document.visibilityState === "visible" && load(true);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (timer) window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, orders, load]);

  if (!ready || !user || (orders === null && !error)) {
    return <div className="to-page" aria-busy="true"><div className="to-state">Loading your orders…</div></div>;
  }

  if (error && orders === null) {
    return (
      <div className="to-page">
        <div className="to-state">
          <p>{error}</p>
          <button type="button" className="acc-btn" onClick={() => load()}>Try again</button>
        </div>
      </div>
    );
  }

  const list = orders ?? [];

  /* ----- first-time visitor ----- */
  if (list.length === 0) {
    return (
      <div className="to-page">
        <div className="to-state to-empty">
          <span className="acc-empty__icon"><FiPackage size={32} /></span>
          <h1>You haven&apos;t placed any orders yet!</h1>
          <p>When you place an order, you can track every step of its journey right here.</p>
          <Link href="/men" className="acc-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const single = list.length === 1;
  const open = single ? list[0] : list.find((o) => o.id === openId) ?? null;

  const header = (
    <div className="to-head">
      <h1>Track Order</h1>
      <button type="button" className="to-refresh" onClick={() => load(true)} disabled={refreshing}>
        <FiRefreshCw className={refreshing ? "is-spin" : ""} /> {refreshing ? "Updating…" : "Refresh"}
      </button>
    </div>
  );

  /* ----- one order, or one chosen from the list ----- */
  if (open) {
    return (
      <div className="to-page">
        {header}
        {error && <p className="to-warn" role="alert">{error} Showing the last known status.</p>}
        {!single && (
          <button type="button" className="to-back" onClick={() => setOpenId(null)}>
            <FiArrowLeft /> All orders
          </button>
        )}
        <Details order={open} />
      </div>
    );
  }

  /* ----- order history, latest first ----- */
  return (
    <div className="to-page">
      {header}
      {error && <p className="to-warn" role="alert">{error} Showing the last known status.</p>}
      <ul className="to-list">
        {list.map((o) => {
          const first = o.items[0];
          const more = o.items.length - 1;
          return (
            <li key={o.id} className="to-card">
              <div className="to-card__top">
                <div>
                  <b>Order #{o.id}</b>
                  <small>Placed on {fmtDate(o.placedAt)}</small>
                </div>
                <Badge order={o} />
              </div>
              <div className="to-card__body">
                <Thumb src={first?.image} alt={first?.name ?? "Order item"} />
                <div className="to-item__info">
                  <b>{first?.name}</b>
                  <small>
                    {[first?.size && `Size: ${first.size}`, (first?.colorName || first?.color) && `Color: ${first.colorName || first.color}`, `Qty: ${first?.qty}`]
                      .filter(Boolean).join(" · ")}
                  </small>
                  {more > 0 && <small>+ {more} more {more === 1 ? "item" : "items"}</small>}
                </div>
                <div className="to-card__total"><small>Total</small><b>{rupee(o.total)}</b></div>
              </div>
              <button type="button" className="to-view" onClick={() => { setOpenId(o.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                View Order Details
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrackOrder;
