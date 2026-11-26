import React from "react";


const ShippingPolicyPage: React.FC = () => {
  return (
    <>

      <section className="legal-content">
        <div className="legal-content__inner">
          <p className="legal-content__updated">Last updated: August 2026</p>

          <div className="legal-block">
            <h2>1. Processing Time</h2>
            <p>
              Orders are processed within 24-48 hours of being placed
              (excluding Sundays and public holidays). You'll receive a
              confirmation email once your order has been packed and handed
              over to our shipping partner.
            </p>
          </div>

          <div className="legal-block">
            <h2>2. Delivery Timelines</h2>
            <ul>
              <li>Metro cities: 3-5 business days</li>
              <li>Non-metro cities: 5-7 business days</li>
              <li>Remote areas: 7-10 business days</li>
            </ul>
            <p>
              Timelines are estimates and may vary due to weather, courier
              delays, or circumstances beyond our control.
            </p>
          </div>

          <div className="legal-block">
            <h2>3. Shipping Charges</h2>
            <p>
              We offer free shipping on all prepaid orders above ₹999. Orders
              below this amount, and all Cash on Delivery orders, are subject
              to a flat shipping fee shown at checkout before you pay.
            </p>
          </div>

          <div className="legal-block">
            <h2>4. Order Tracking</h2>
            <p>
              Once your order ships, you'll receive a tracking link via email
              and SMS. You can also track your order anytime from the{" "}
              <a href="/track-order">Track Order</a> page using your order ID.
            </p>
          </div>

          <div className="legal-block">
            <h2>5. Serviceable Locations</h2>
            <p>
              We currently ship across India to most pin codes. If your pin
              code isn't serviceable, you'll be notified at checkout before
              you complete payment.
            </p>
          </div>

          <div className="legal-block">
            <h2>6. Delayed or Lost Shipments</h2>
            <p>
              If your order hasn't arrived within the estimated delivery
              window, please reach out to our support team with your order
              ID and we'll investigate with our courier partner right away.
            </p>
          </div>

          <div className="legal-block">
            <h2>7. Damaged Packages</h2>
            <p>
              If your package arrives damaged, please don't accept the
              delivery, or if already accepted, contact us within 48 hours
              with photos of the damaged item and packaging so we can resolve
              it quickly.
            </p>
          </div>

          <div className="legal-block">
            <h2>8. Contact Us</h2>
            <p>
              Questions about your shipment? Reach us at{" "}
              <a href="mailto:support@stylevin.com">support@stylevin.com</a>{" "}
              or +91 7969328400.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingPolicyPage;