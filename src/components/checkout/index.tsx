import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiPlus, FiEdit2, FiLock, FiTruck, FiCreditCard } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/lib/auth";
import {
  Address, AddressErrors, COUNTRIES, INDIAN_STATES, PAYMENT_METHODS, SHIPPING_METHODS,
  PaymentMethodId, ShippingMethodId, createOrder, emptyAddress, fetchAddresses,
  saveAddress, saveOrderSnapshot, sameAddress, shippingCharge, validateAddress,
  FREE_SHIPPING_FROM,
} from "@/lib/checkout";

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const lineKey = (i: { id: number; size?: string; color?: string }) => `${i.id}|${i.size ?? ""}|${i.color ?? ""}`;

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { items, count, subtotal, savings, ready: cartReady } = useCart();

  const [saved, setSaved] = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [mode, setMode] = useState<"list" | "form">("form");
  const [form, setForm] = useState<Address>(emptyAddress());
  const [original, setOriginal] = useState<Address | null>(null); // address being edited, before changes
  const [errors, setErrors] = useState<AddressErrors>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("standard");
  const [payment, setPayment] = useState<PaymentMethodId>("online");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // not logged in -> login/signup, then straight back here
  useEffect(() => {
    if (authReady && !user) router.replace("/profile?redirect=" + encodeURIComponent("/checkout"));
  }, [authReady, user, router]);

  // load saved addresses + pre-fill name / email from the account
  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoadingAddr(true);
    fetchAddresses(user).then((list) => {
      if (!alive) return;
      setSaved(list);
      if (list.length > 0) {
        const def = list.find((a) => a.isDefault) ?? list[0];
        setSelectedId(def.id ?? null);
        setMode("list");
      } else {
        setForm(emptyAddress(user));
        setMode("form");
      }
      setLoadingAddr(false);
    });
    return () => { alive = false; };
  }, [user]);

  const shipping = shippingCharge(shippingMethod, payment, subtotal);
  const total = subtotal + shipping;
  const selected = useMemo(() => saved.find((a) => a.id === selectedId) ?? null, [saved, selectedId]);
  const activeAddress = mode === "form" ? form : selected;

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const startNew = () => {
    setForm(emptyAddress(user));
    setOriginal(null);
    setErrors({});
    setMode("form");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const startEdit = (a: Address) => {
    setForm({ ...a, address2: a.address2 ?? "" });
    setOriginal(a);
    setErrors({});
    setMode("form");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const cancelForm = () => {
    setErrors({});
    setMode("list");
  };

  const placeOrder = async () => {
    setError("");
    const address = activeAddress;
    if (!address) {
      setError("Please add a shipping address.");
      return;
    }
    const errs = validateAddress(address);
    if (Object.keys(errs).length) {
      if (mode === "list" && selected) startEdit(selected);
      setErrors(errs);
      setError("Please fix the highlighted fields.");
      return;
    }
    if (address.country !== "India") {
      setErrors({ country: "We currently deliver only within India" });
      setError("We currently deliver only within India.");
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);
    try {
      const totals = { subtotal, savings, shipping, total };
      const result = await createOrder({ items, address, shippingMethod, paymentMethod: payment, totals });

      saveOrderSnapshot({
        orderId: result.orderId,
        placedAt: new Date().toISOString(),
        items,
        address,
        shippingMethod,
        paymentMethod: payment,
        totals,
      });

      // save a new / edited address to the account (an unchanged saved address is left alone)
      const changed = mode === "form" && !(original && sameAddress(original, address));
      if (user && changed) {
        try { await saveAddress(user, address); } catch { /* the order is already placed */ }
      }

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl; // gateway returns to /order-confirmation
        return;
      }
      router.push(`/order-confirmation?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  /* ---------------- states ---------------- */
  if (!authReady || !cartReady || !user) {
    return <div className="co-page" aria-busy="true"><div className="co-loading">Loading checkout…</div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="co-page">
        <div className="co-empty">
          <p>Your cart is empty.</p>
          <Link href="/men" className="acc-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  const field = (k: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div className="co-field">
      <label htmlFor={`co-${k}`}>{label}{optional && <span className="co-opt"> (optional)</span>}</label>
      <input
        id={`co-${k}`}
        className={`co-input ${errors[k] ? "has-error" : ""}`}
        value={(form[k] as string) ?? ""}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        {...props}
      />
      {errors[k] && <span className="co-error">{errors[k]}</span>}
    </div>
  );

  return (
    <div className="co-page">
      <h1 className="co-title">Checkout</h1>

      <div className="co-layout">
        <div className="co-main">
          {/* ---------- shipping address ---------- */}
          <section className="co-card" aria-labelledby="co-ship-h">
            <h2 id="co-ship-h">Shipping Address</h2>

            {loadingAddr ? (
              <p className="co-muted">Loading your saved addresses…</p>
            ) : (
              <>
                {mode === "list" && (
                  <>
                    <ul className="co-addr-list">
                      {saved.map((a) => (
                        <li key={String(a.id)} className={`co-addr ${a.id === selectedId ? "is-active" : ""}`}>
                          <label>
                            <input
                              type="radio"
                              name="address"
                              checked={a.id === selectedId}
                              onChange={() => setSelectedId(a.id ?? null)}
                            />
                            <span className="co-addr__text">
                              <b>{a.firstName} {a.lastName}</b>
                              <span>
                                {a.address1}{a.address2 ? `, ${a.address2}` : ""}, {a.city}, {a.state} – {a.pin}
                              </span>
                              <span>{a.country} · {a.phone}</span>
                              <span>{a.email}</span>
                            </span>
                          </label>
                          <button type="button" className="co-link" onClick={() => startEdit(a)}>
                            <FiEdit2 /> Edit
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="co-add" onClick={startNew}>
                      <FiPlus /> Add a new address
                    </button>
                  </>
                )}

                {mode === "form" && (
                  <div ref={formRef} className="co-form">
                    <div className="co-field co-span-2">
                      <label htmlFor="co-country">Country / Region</label>
                      <select
                        id="co-country"
                        className={`co-input ${errors.country ? "has-error" : ""}`}
                        value={form.country}
                        onChange={set("country")}
                      >
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      {errors.country && <span className="co-error">{errors.country}</span>}
                      {form.country !== "India" && !errors.country && (
                        <span className="co-error">We currently deliver only within India.</span>
                      )}
                    </div>

                    {field("firstName", "First name", { autoComplete: "given-name" })}
                    {field("lastName", "Last name", { autoComplete: "family-name" })}
                    <div className="co-span-2">
                      {field("address1", "Address", { autoComplete: "address-line1", placeholder: "Street address" })}
                    </div>
                    <div className="co-span-2">
                      {field("address2", "Apartment, suite, unit, etc.", { autoComplete: "address-line2" }, true)}
                    </div>
                    {field("city", "City", { autoComplete: "address-level2" })}

                    <div className="co-field">
                      <label htmlFor="co-state">State</label>
                      <select
                        id="co-state"
                        className={`co-input ${errors.state ? "has-error" : ""}`}
                        value={form.state}
                        onChange={set("state")}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {errors.state && <span className="co-error">{errors.state}</span>}
                    </div>

                    {field("pin", "PIN Code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
                    {field("phone", "Phone number", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "10-digit mobile number" })}
                    <div className="co-span-2">
                      {field("email", "Email address", { type: "email", autoComplete: "email" })}
                    </div>

                    {saved.length > 0 && (
                      <div className="co-span-2">
                        <button type="button" className="co-link" onClick={cancelForm}>
                          ← Use a saved address instead
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          {/* ---------- shipping method ---------- */}
          <section className="co-card" aria-labelledby="co-method-h">
            <h2 id="co-method-h"><FiTruck /> Shipping Method</h2>
            <div className="co-options">
              {SHIPPING_METHODS.map((m) => {
                const price = shippingCharge(m.id, payment, subtotal);
                return (
                  <label key={m.id} className={`co-option ${shippingMethod === m.id ? "is-active" : ""}`}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                    />
                    <span className="co-option__text">
                      <b>{m.label}</b>
                      <small>{m.eta}</small>
                    </span>
                    <span className="co-option__price">{price === 0 ? "Free" : rupee(price)}</span>
                  </label>
                );
              })}
            </div>
            {subtotal < FREE_SHIPPING_FROM && (
              <p className="co-muted">
                Add {rupee(FREE_SHIPPING_FROM - subtotal)} more for free standard shipping on prepaid orders.
              </p>
            )}
          </section>

          {/* ---------- payment ---------- */}
          <section className="co-card" aria-labelledby="co-pay-h">
            <h2 id="co-pay-h"><FiCreditCard /> Payment Method</h2>
            <div className="co-options">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`co-option ${payment === m.id ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                  />
                  <span className="co-option__text">
                    <b>{m.label}</b>
                    <small>{m.desc}</small>
                  </span>
                </label>
              ))}
            </div>
            <p className="co-secure"><FiLock /> All transactions are secure and encrypted.</p>
          </section>
        </div>

        {/* ---------- order summary ---------- */}
        <aside className="co-summary" aria-label="Order summary">
          <h2>Order Summary</h2>

          <ul className="co-items">
            {items.map((i) => (
              <li key={lineKey(i)} className="co-item">
                <div className="co-item__img">
                  <Image src={i.image} alt={i.name} fill sizes="64px" />
                  <span className="co-item__qty">{i.qty}</span>
                </div>
                <div className="co-item__info">
                  <b>{i.name}</b>
                  <small>
                    {[i.size && `Size: ${i.size}`, i.colorName && `Color: ${i.colorName}`].filter(Boolean).join(" · ")}
                  </small>
                  <small>{rupee(i.price)} × {i.qty}</small>
                </div>
                <span className="co-item__total">{rupee(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="co-totals">
            <div><dt>Total MRP ({count} {count === 1 ? "item" : "items"})</dt><dd>{rupee(subtotal + savings)}</dd></div>
            {savings > 0 && (
              <div className="co-save"><dt>Discount on MRP</dt><dd>− {rupee(savings)}</dd></div>
            )}
            <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : rupee(shipping)}</dd></div>
            <div className="co-total"><dt>Total Amount</dt><dd>{rupee(total)}</dd></div>
          </dl>

          {/* review before placing */}
          <div className="co-review">
            <p><b>Deliver to:</b>{" "}
              {activeAddress && activeAddress.address1
                ? `${activeAddress.firstName} ${activeAddress.lastName}, ${activeAddress.address1}, ${activeAddress.city}, ${activeAddress.state} ${activeAddress.pin}`
                : "—  add your address"}
            </p>
            <p><b>Shipping:</b> {SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.label}</p>
            <p><b>Payment:</b> {PAYMENT_METHODS.find((m) => m.id === payment)?.label}</p>
          </div>

          {error && <p className="co-error co-error--block" role="alert">{error}</p>}

          <button type="button" className="cart-place-order" onClick={placeOrder} disabled={placing || loadingAddr}>
            {placing ? "Placing order…" : payment === "online" ? `Pay ${rupee(total)}` : "Place Order"}
          </button>
          <Link href="/cart" className="co-back">← Back to cart</Link>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
