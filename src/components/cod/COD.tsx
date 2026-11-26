"use client";

import { useState } from "react";

const steps = [
  {
    step: "01",
    title: "Place Your Order",
    desc: "Add items to your cart and select Cash on Delivery at checkout — no card or online payment needed.",
  },
  {
    step: "02",
    title: "We Pack & Ship",
    desc: "Your order is packed and dispatched pan-India, arriving within 6–7 days.",
  },
  {
    step: "03",
    title: "Pay at Your Door",
    desc: "Pay the delivery agent in cash when your order arrives. That's it.",
  },
];

const strip = [
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    label: "No advance payment required",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    label: "7-day easy exchange, even on COD",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    ),
    label: "Available on most pincodes pan-India",
  },
];

const faqs = [
  {
    q: "Is COD available on all orders?",
    a: "COD is available on most pincodes and order values. If it's not available for your location, you'll see prepaid-only options at checkout.",
  },
  {
    q: "Is there an extra charge for COD?",
    a: "Some orders may include a small COD handling fee, shown clearly at checkout before you confirm.",
  },
  {
    q: "Can I pay by UPI or card at the door instead of cash?",
    a: "This depends on the delivery partner in your area. Keep exact cash handy just in case.",
  },
  {
    q: "What if I want to return a COD order?",
    a: "COD orders follow the same 7-day exchange window as prepaid orders. Refunds for COD returns are issued to your bank account or as store credit.",
  },
];

const COD = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <>
      <section className="cod-steps">
        <div className="cod-steps__eyebrow">
          <div className="cod-badge">
            <span className="cod-badge-pin" />
            <span className="cod-badge-eyebrow">How It Works</span>
            <span className="cod-badge-underline" />
          </div>
          <h2 className="cod-steps-title">From cart to your doorstep</h2>
        </div>

        <div className="cod-route">
          {steps.map((s) => (
            <div className="cod-stop" key={s.step}>
              <div className="cod-stop__dot">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="cod-strip">
          {strip.map((item) => (
            <div className="cod-strip-item" key={item.label}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cod-faq">
        <div className="cod-faq__inner">
          <div className="cod-badge" style={{ display: "flex", margin: "0 auto 14px" }}>
            <span className="cod-badge-pin" />
            <span className="cod-badge-eyebrow">Need To Know</span>
            <span className="cod-badge-underline" />
          </div>
          <h2 className="cod-faq__title">Common Questions</h2>

          {faqs.map((f, i) => (
            <div
              className={`cod-faq__item ${openIndex === i ? "open" : ""}`}
              key={f.q}
            >
              <button
                type="button"
                className="cod-faq__q"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{f.q}</span>
                <span className="plus" />
              </button>
              <div className="cod-faq__a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default COD;