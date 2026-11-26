import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>

      <section className="legal-content">
        <div className="legal-content__inner">
          <p className="legal-content__updated">Last updated: August 2026</p>

          <div className="legal-block">
            <h2>1. Information We Collect</h2>
            <p>
              When you shop with STYLEVIN, we collect information you give us
              directly — like your name, email, phone number, shipping
              address, and payment details at checkout. We also automatically
              collect data such as your IP address, browser type, device
              information, and browsing behavior on our site to improve your
              experience.
            </p>
          </div>

          <div className="legal-block">
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To process and deliver your orders</li>
              <li>To send order updates, receipts, and shipping notifications</li>
              <li>To personalize product recommendations and offers</li>
              <li>To improve our website, products, and customer service</li>
              <li>To prevent fraud and maintain account security</li>
            </ul>
          </div>

          <div className="legal-block">
            <h2>3. Sharing Your Information</h2>
            <p>
              We never sell your personal data. We only share information
              with trusted third parties who help us run our business —
              payment processors, shipping partners, and analytics providers
              — and only to the extent necessary for them to perform their
              services.
            </p>
          </div>

          <div className="legal-block">
            <h2>4. Cookies</h2>
            <p>
              We use cookies to remember your cart, preferences, and login
              session, and to understand how you use our site so we can make
              it better. You can disable cookies in your browser settings,
              though some features may not work as expected.
            </p>
          </div>

          <div className="legal-block">
            <h2>5. Data Security</h2>
            <p>
              We use industry-standard encryption and security practices to
              protect your data. All payment transactions are processed
              through secure, PCI-compliant gateways — we never store your
              full card details on our servers.
            </p>
          </div>

          <div className="legal-block">
            <h2>6. Your Rights</h2>
            <p>
              You can request access to, correction of, or deletion of your
              personal data at any time by reaching out to our support team.
              You can also opt out of marketing emails using the unsubscribe
              link in any email we send.
            </p>
          </div>

          <div className="legal-block">
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this policy occasionally to reflect changes in
              our practices or for legal reasons. We'll post the revised
              version here with an updated date.
            </p>
          </div>

          <div className="legal-block">
            <h2>8. Contact Us</h2>
            <p>
              Questions about your privacy? Reach us at{" "}
              <a href="mailto:support@stylevin.com">support@stylevin.com</a>{" "}
              or +91 7969328400.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;