import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const faqItems: FaqItem[] = [
  {
    q: 'How long until I hear back?',
    a: 'Email and form replies land within 24 hours on business days. Live chat is usually under 10 minutes during support hours.',
  },
  {
    q: 'Can I change my order after placing it?',
    a: "Yes, within 2 hours of checkout. Message us with your order ID and we'll sort it before it ships.",
  },
  {
    q: 'Do you help with sizing over chat?',
    a: "Always. Send us your usual size and the piece you're eyeing — we'll tell you straight if it runs big or small.",
  },
  {
    q: 'Is the store visit walk-in only?',
    a: 'Walk-ins are welcome, but message us first if you want a specific piece pulled and ready before you arrive.',
  },
];

const Contact4: React.FC = () => {
  // Separate state for LEFT and RIGHT FAQ columns
  const [openLeftFaq, setOpenLeftFaq] = useState<number | null>(null);
  const [openRightFaq, setOpenRightFaq] = useState<number | null>(null);

  const toggleLeftFaq = (i: number) => {
    setOpenLeftFaq((prev) => (prev === i ? null : i));
  };

  const toggleRightFaq = (i: number) => {
    setOpenRightFaq((prev) => (prev === i ? null : i));
  };

  return (
    <section className="faq-section">
      <div className="wrap">
        <header className="instagram-section__header">
          <span className="instagram-section__eyebrow">
            Before You Message
          </span>
          <h2 className="instagram-section__title">QUICK ANSWERS</h2>
        </header>

        <div className="faq-grid">
          {/* LEFT COLUMN */}
          <div className="faq-column">
            {faqItems.slice(0, 2).map((item, i) => (
              <div
                className={`faq-item ${openLeftFaq === i ? 'open' : ''}`}
                key={item.q}
              >
                <div
                  className="q"
                  onClick={() => toggleLeftFaq(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleLeftFaq(i);
                    }
                  }}
                >
                  {item.q}
                  <span className="plus">+</span>
                </div>

                <div className="a">{item.a}</div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="faq-column">
            {faqItems.slice(2, 4).map((item, i) => (
              <div
                className={`faq-item ${openRightFaq === i ? 'open' : ''}`}
                key={item.q}
              >
                <div
                  className="q"
                  onClick={() => toggleRightFaq(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleRightFaq(i);
                    }
                  }}
                >
                  {item.q}
                  <span className="plus">+</span>
                </div>

                <div className="a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact4;