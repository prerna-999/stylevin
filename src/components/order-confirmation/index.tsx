import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { OrderSnapshot, PAYMENT_METHODS, SHIPPING_METHODS, readOrderSnapshot } from "@/lib/checkout";

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const CLEARED_KEY = "stylevin_cleared_order";

const OrderConfirmation: React.FC = () => {
  const router = useRouter();
  const { clear, ready } = useCart();
  const [snap, setSnap] = useState<OrderSnapshot | null>(null);
  const [checked, setChecked] = useState(false);

  const orderId = typeof router.query.orderId === "string" ? router.query.orderId : "";
  const failed = router.query.status === "failed";

  useEffect(() => {
    if (!router.isReady || !ready) return;
    const s = readOrderSnapshot();
    const match = s && (!orderId || s.orderId === orderId) ? s : null;
    setSnap(match);
    setChecked(true);

    // the order is placed -> empty the cart (once), unless the online payment failed
    if (!failed && orderId) {
      try {
        if (sessionStorage.getItem(CLEARED_KEY) !== orderId) {
          clear();
          sessionStorage.setItem(CLEARED_KEY, orderId);
        }
      } catch {
        clear();
      }
    }
  }, [router.isReady, ready, orderId, failed, clear]);

  if (!router.isReady || !checked) {
    return <div className="co-page" aria-busy="true"><div className="co-loading">Loading…</div></div>;
  }

  if (failed) {
    return (
      <div className="co-page">
        <div className="co-done">
          <FiAlertCircle className="co-done__icon co-done__icon--bad" />
          <h1>Payment not completed</h1>
          <p>Your payment didn&apos;t go through and you haven&apos;t been charged. Your cart is still saved.</p>
          <div className="co-done__actions">
            <Link href="/checkout" className="acc-btn">Try again</Link>
            <Link href="/cart" className="co-link">Back to cart</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderId && !snap) {
    return (
      <div className="co-page">
        <div className="co-done">
          <h1>No recent order found</h1>
          <Link href="/men" className="acc-btn">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const id = orderId || snap?.orderId;

  return (
    <div className="co-page">
      <div className="co-done">
        <FiCheckCircle className="co-done__icon" />
        <h1>Thank you! Your order is confirmed.</h1>
        <p>Order number: <b>{id}</b></p>
        {snap?.address.email && <p>A confirmation will be sent to {snap.address.email}.</p>}

        {snap && (
          <div className="co-done__card">
            <ul className="co-items">
              {snap.items.map((i) => (
                <li key={`${i.id}|${i.size}|${i.color}`} className="co-item">
                  <div className="co-item__img">
                    <Image src={i.image} alt={i.name} fill sizes="64px" />
                    <span className="co-item__qty">{i.qty}</span>
                  </div>
                  <div className="co-item__info">
                    <b>{i.name}</b>
                    <small>{[i.size && `Size: ${i.size}`, i.colorName && `Color: ${i.colorName}`].filter(Boolean).join(" · ")}</small>
                  </div>
                  <span className="co-item__total">{rupee(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="co-totals">
              {snap.totals.savings > 0 && <div className="co-save"><dt>Discount</dt><dd>− {rupee(snap.totals.savings)}</dd></div>}
              <div><dt>Shipping</dt><dd>{snap.totals.shipping === 0 ? "Free" : rupee(snap.totals.shipping)}</dd></div>
              <div className="co-total"><dt>Total</dt><dd>{rupee(snap.totals.total)}</dd></div>
            </dl>

            <div className="co-review">
              <p><b>Shipping to:</b> {snap.address.firstName} {snap.address.lastName}, {snap.address.address1}
                {snap.address.address2 ? `, ${snap.address.address2}` : ""}, {snap.address.city}, {snap.address.state} {snap.address.pin}</p>
              <p><b>Shipping method:</b> {SHIPPING_METHODS.find((m) => m.id === snap.shippingMethod)?.label}</p>
              <p><b>Payment:</b> {PAYMENT_METHODS.find((m) => m.id === snap.paymentMethod)?.label}</p>
            </div>
          </div>
        )}

        <div className="co-done__actions">
          <Link href="/men" className="acc-btn">Continue shopping</Link>
          <Link href="/track-order" className="co-link">Track my order</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
