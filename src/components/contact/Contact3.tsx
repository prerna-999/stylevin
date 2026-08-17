import React, { useState } from 'react';
import { FiPhone, FiMail, FiInstagram, FiFacebook, FiLinkedin, FiTwitter } from 'react-icons/fi';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  topic: 'Order & Shipping',
  message: '',
};


const Contact3: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(initialFormState);
  };

  return (
    <section className="form-section">
      <div className="wrap">
        <div className="form-grid">
          <div className="ticket-card">
            <div className="ticket-punch" />
            <div className="form-eyebrow">Drop Us A Line</div>
            <h3 className="form-title">Send It Over</h3>
            <p className="form-sub">
              Fill it out, hit send — we&rsquo;ll get back before your next scroll session ends.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="What do we call you?"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="topic">Topic</label>
                  <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
                    <option>Order & Shipping</option>
                    <option>Returns & Exchange</option>
                    <option>Sizing Help</option>
                    <option>Collab / Press</option>
                    <option>Something Else</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's up..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <div className="submit-row">
                <button type="submit" className="btn-slap">Send Message →</button>
                <span className="form-note">
                  {submitted ? "Sent! We'll reply within 24 hrs." : 'We reply within 24 hrs, easy no cap.'}
                </span>
              </div>
            </form>
          </div>

          <div className="side-stack">
            <div className="info-tag">
              <h4>Head Office</h4>
              <div className="row">
                <span className="ico"><FiPhone /></span>
                <div>
                  <span className="lbl">Phone</span>
                  <p>+91 79693 28400</p>
                </div>
              </div>
              <div className="row">
                <span className="ico"><FiMail /></span>
                <div>
                  <span className="lbl">Email</span>
                  <p>support@stylevin.com</p>
                </div>
              </div>
            </div>

            <div className="hours-card">
              <h4>Support Hours</h4>
              <div className="day-row"><span>Monday – Friday</span><span>10:00 – 19:00</span></div>
              <div className="day-row"><span>Saturday</span><span>10:00 – 17:00</span></div>
              <div className="day-row"><span>Sunday</span><span>Closed</span></div>
            </div>

            <div className="social-strip">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact3;