import React from 'react';
import { FiPhone, FiMail, FiMessageCircle, FiPackage } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface ContactOption {
  index: string;
  icon: IconType;
  title: string;
  desc: string;
  linkLabel: string;
  linkHref: string;
}

const contactOptions: ContactOption[] = [
  {
    index: '01',
    icon: FiPhone,
    title: 'Call Us',
    desc: 'Mon–Sat, 10am–7pm IST. Talk sizing, orders, or returns direct.',
    linkLabel: '+91 79693 28400',
    linkHref: 'tel:+917969328400',
  },
  {
    index: '02',
    icon: FiMail,
    title: 'Email Us',
    desc: 'For anything detailed — order IDs, exchanges, collabs.',
    linkLabel: 'support@stylevin.com',
    linkHref: 'mailto:support@stylevin.com',
  },
  {
    index: '03',
    icon: FiMessageCircle,
    title: 'WhatsApp Us',
    desc: 'Quick questions, order updates, no waiting on hold.',
    linkLabel: 'Message on WhatsApp',
    linkHref: 'https://wa.me/917969328400',
  },
  {
    index: '04',
    icon: FiPackage,
    title: 'Track Your Order',
    desc: "Already ordered? Check exactly where it's at, live.",
    linkLabel: 'Track Order',
    linkHref: '#track',
  },
];

const Contact2: React.FC = () => {
  return (
    
    <section className="tags-section">
      <div className="wrap">
        <div className="trending-now__badge" aria-hidden="true">
        <span className="trending-now__badge-pin" />
        <span className="trending-now__badge-eyebrow">Reach Us Your Way</span>
        <span className="trending-now__badge-title">PICK YOUR LANE</span>
        <span className="trending-now__badge-underline" />
      </div>

        <div className="tag-grid">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div className="hangtag" key={option.index}>
                <span className="tag-index">{option.index}</span>
                <div className="hole" />
                <div className="icon-circle">
                  <Icon />
                </div>
                <h4>{option.title}</h4>
                <p>{option.desc}</p>
                <a className="link" href={option.linkHref}>
                  {option.linkLabel}
                </a>
              </div>
            );
          })}
        </div>
      </div>

    <svg
          className="tags-section-curve"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          width="100%"
          height="80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 C240,10 480,90 720,60 C960,30 1200,80 1440,40 L1440,100 L0,100 Z"
            fill="var(--color-2)"
          />
        </svg>

    </section>
  );
};

export default Contact2;