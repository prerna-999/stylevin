import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const CATEGORIES = ["All", "Orders", "Shipping", "Returns", "Sizing", "Payments"];

const FAQ_DATA: FaqItem[] = [
    {
        id: 1,
        question: "How long does delivery take?",
        answer:
            "Most orders ship within 24-48 hours and reach you in 3-7 business days depending on your location. You'll get tracking the moment it leaves our warehouse.",
        category: "Shipping",
    },
    {
        id: 2,
        question: "Can I change or cancel my order after placing it?",
        answer:
            "Yes — within 2 hours of placing it. After that it's already moving through packing, so reach out fast via WhatsApp or email and we'll try our best.",
        category: "Orders",
    },
    {
        id: 3,
        question: "What's your return and exchange policy?",
        answer:
            "Easy returns within 7 days of delivery, no awkward questions. Items must be unworn with tags attached. Refunds are processed within 5-7 business days.",
        category: "Returns",
    },
    {
        id: 4,
        question: "How do I know which size to pick?",
        answer:
            "Every product page has a size chart with measurements, not just S/M/L guesses. Still unsure? Message us and we'll help you dial in the right fit.",
        category: "Sizing",
    },
    {
        id: 5,
        question: "Do you offer Cash on Delivery?",
        answer:
            "Yes, COD is available on most pin codes across India. You'll see the option at checkout if it's available for your address.",
        category: "Payments",
    },
    {
        id: 6,
        question: "Is Cash on Delivery available everywhere?",
        answer:
            "COD is currently supported for most pin codes across India. You'll see it as an option at checkout automatically if it's available in your area.",
        category: "Orders",
    },
    {
        id: 7,
        question: "How do I track my order?",
        answer:
            "Once your order ships, you'll get a tracking link via email and SMS. You can also check live status anytime from the Track Order page.",
        category: "Shipping",
    },
    {
        id: 8,
        question: "What payment methods do you accept?",
        answer:
            "Cards, UPI, net banking, wallets, and COD where available. All transactions are 100% secure and encrypted at checkout.",
        category: "Payments",
    },
];

const FaqSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [openId, setOpenId] = useState<number | null>(1);

    const filteredFaqs =
        activeCategory === "All"
            ? FAQ_DATA
            : FAQ_DATA.filter((f) => f.category === activeCategory);

    const toggleFaq = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="faqpage-section">
            <div className="faqpage-section__inner">
                <div className="trending-now__badge" aria-hidden="true">
                    <span className="trending-now__badge-pin" />
                    <span className="trending-now__badge-eyebrow">BEFORE YOU ASK </span>
                    <span className="trending-now__badge-title">GOT QUESTIONS?</span>
                    <span className="trending-now__badge-underline" />
                </div>
                <p className="faqpage-section__subtitle mb-40">
                    Everything you need to know about orders, shipping, sizing, and
                    returns — all in one place. Still stuck? Drop us a line, we reply
                    fast, no bots.
                </p>

                <div className="faqpage-section__filters">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`faqpage-section__filter-btn ${activeCategory === cat ? "is-active" : ""
                                }`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="faqpage-section__list">
                    {filteredFaqs.map((faq) => {
                        const isOpen = openId === faq.id;
                        return (
                            <div
                                key={faq.id}
                                className={`faqpage-item ${isOpen ? "is-open" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="faqpage-item__question"
                                    onClick={() => toggleFaq(faq.id)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faqpage-item__icon">
                                        {isOpen ? "\u2212" : "+"}
                                    </span>
                                </button>
                                <div className="faqpage-item__answer-wrap">
                                    <p className="faqpage-item__answer">{faq.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="faqpage-section__cta">
                    <p className="faqpage-section__cta-text mb-20">Still didn't find your answer?</p>
                    <Link href="/contact" className="stylebtn mt-20">
                        <span className="stylebtn__pin" />
                        <span className="stylebtn__eyebrow">
                            CONTACT US
                            <span className="stylebtn__arrow" aria-hidden="true">
                                <FiArrowRight />
                            </span>
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;