import React from "react";

const Terms: React.FC = () => {
  return (
    <>

      <section className="legal-content">
        <div className="legal-content__inner">
          <p className="legal-content__updated">Last updated: August 2026</p>

          <div className="legal-block">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the STYLEVIN website, you agree to be
              bound by these Terms &amp; Conditions. If you don't agree with
              any part of these terms, please don't use our site.
            </p>
          </div>

          <div className="legal-block">
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old, or using the site under the
              supervision of a parent or guardian, to place an order with us.
            </p>
          </div>

          <div className="legal-block">
            <h2>3. Product Information</h2>
            <p>
              We do our best to display accurate colors, sizing, and
              descriptions for every product. Slight variations may occur due
              to screen settings or manufacturing batches. We reserve the
              right to correct any errors, inaccuracies, or omissions at any
              time.
            </p>
          </div>

          <div className="legal-block">
            <h2>4. Pricing &amp; Payment</h2>
            <p>
              All prices are listed in INR and are subject to change without
              prior notice. Payment must be completed in full at checkout
              through our supported payment methods, or via Cash on Delivery
              where available.
            </p>
          </div>

          <div className="legal-block">
            <h2>5. Order Acceptance</h2>
            <p>
              Placing an order doesn't guarantee acceptance. We may cancel or
              refuse any order due to stock issues, pricing errors, or
              suspected fraudulent activity — you'll be notified and fully
              refunded if this happens.
            </p>
          </div>

          <div className="legal-block">
            <h2>6. Intellectual Property</h2>
            <p>
              All content on this site — including logos, designs, images,
              and text — is the property of STYLEVIN and protected by
              copyright law. You may not reproduce or use it without written
              permission.
            </p>
          </div>

          <div className="legal-block">
            <h2>7. User Conduct</h2>
            <p>
              You agree not to misuse the site, attempt unauthorized access
              to our systems, or use the platform for any unlawful purpose.
              We reserve the right to suspend accounts that violate these
              terms.
            </p>
          </div>

          <div className="legal-block">
            <h2>8. Limitation of Liability</h2>
            <p>
              STYLEVIN is not liable for any indirect, incidental, or
              consequential damages arising from your use of the site or
              products purchased, to the extent permitted by law.
            </p>
          </div>

          <div className="legal-block">
            <h2>9. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes
              will be subject to the exclusive jurisdiction of the courts
              where STYLEVIN is registered.
            </p>
          </div>

          <div className="legal-block">
            <h2>10. Contact Us</h2>
            <p>
              For questions about these Terms, reach out at{" "}
              <a href="mailto:support@stylevin.com">support@stylevin.com</a>{" "}
              or +91 7969328400.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;