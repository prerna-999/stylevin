'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface FooterLink {
  url: string;
  name: string;
}

interface SocialLink {
  url: string;
  image: string;
  label: string;
}

interface PaymentBadge {
  name: string;
  image: string;
}

const needHelpLinks: FooterLink[] = [
  { url: '/contact/', name: 'Contact Us' },
  { url: '/faq/', name: "FAQ's" },
  { url: '/account/', name: 'My Account' },
  { url: '/track-order/', name: 'Track Order' },
  { url: '/returns-refunds/', name: 'Returns & Refunds' },
  { url: '/cod/', name: 'COD Available' },
];

const moreInfoLinks: FooterLink[] = [
  { url: '/about/', name: 'About Us' },
  { url: '/blogs/', name: "Blog's" },
  { url: '/terms-and-condition/', name: 'Terms' },
  { url: '/sitemap/', name: 'Sitemap' },
  { url: '/privacy-policy/', name: 'Privacy Policy' },
  { url: '/shipping-policy/', name: 'Shipping Policy' },
];

const categoryLinks: FooterLink[] = [
  { url: '/category/men-clothing/', name: 'Men Clothing' },
  { url: '/category/women-clothing/', name: 'Women Clothing' },
  { url: '/category/kid-clothing/', name: 'Kid Clothing' },
  { url: '/category/accessories/', name: 'Accessories' },
  { url: '/category/over-sized-t-shirt/', name: 'Over sized T-Shirt' },
  { url: '/category/zodiac-sign-t-shirt/', name: 'Zodiac Sign T-Shirt' },
];

const socialLinks: SocialLink[] = [
  {
    url: 'https://www.facebook.com/',
    image: '/assets/img/icons/facebook.svg',
    label: 'Facebook',
  },
  {
    url: 'https://www.instagram.com/',
    image: '/assets/img/icons/instagram.svg',
    label: 'Instagram',
  },
  {
    url: 'https://www.linkedin.com/',
    image: '/assets/img/icons/linkedin.svg',
    label: 'LinkedIn',
  },
  {
    url: 'https://x.com/',
    image: '/assets/img/icons/twitter.svg',
    label: 'Twitter',
  },
];

const paymentBadges: PaymentBadge[] = [
  { name: 'RuPay', image: '/assets/img/icons/rupay.svg' },
  { name: 'PhonePe', image: '/assets/img/icons/phonepe.svg' },
  { name: 'UPI', image: '/assets/img/icons/upi.svg' },
  { name: 'G Pay', image: '/assets/img/icons/google-pay.svg' },
  { name: 'Paytm', image: '/assets/img/icons/paytm.svg' },
  { name: 'COD', image: '/assets/img/icons/door-service.svg' },
];

const currentYear = new Date().getFullYear();

const FooterLayout = () => {
  return (
    <>
      <div className="sectionDivider">
        <svg
          className="sectionDivider__waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0
                58-18 88-18s
                58 18 88 18
                58-18 88-18
                58 18 88 18
                v44h-352z"
            />
          </defs>
          <g className="sectionDivider__parallax1">
            <use xlinkHref="#gentle-wave" x="50" y="3" fill="currentColor" />
          </g>
          <g className="sectionDivider__parallax2">
            <use xlinkHref="#gentle-wave" x="50" y="0" fill="currentColor" />
          </g>
          <g className="sectionDivider__parallax3">
            <use xlinkHref="#gentle-wave" x="50" y="9" fill="currentColor" />
          </g>
          <g className="sectionDivider__parallax4">
            <use xlinkHref="#gentle-wave" x="50" y="6" fill="currentColor" />
          </g>
        </svg>
      </div>

      <footer className="footer">
        <Container>
          <Row>
            <Col lg={3} md={6} xs={12} className="mt-30">
              <h3 className="heading">Need Help</h3>
              <ul className="linkList">
                {needHelpLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.url}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </Col>

            <Col lg={3} md={6} xs={12} className="mt-30">
              <h3 className="heading">More Info</h3>
              <ul className="linkList">
                {moreInfoLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.url}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </Col>

            <Col lg={3} md={6} xs={12} className="mt-30">
              <h3 className="heading">Categories</h3>
              <ul className="linkList">
                {categoryLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.url}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </Col>

            <Col lg={3} md={6} xs={12} className="mt-30">
              <h3 className="heading">Location</h3>
              <ul className="contactList">
                <li>
                  <a href="tel:+917969328400">
                    <span className="iconCircle">
                      <FaPhoneAlt />
                    </span>
                    +91 7969328400
                  </a>
                </li>
                <li>
                  <a href="mailto:support@stylevin.com">
                    <span className="iconCircle">
                      <FaEnvelope />
                    </span>
                    support@stylevin.com
                  </a>
                </li>
                {/* <li>
                  <a
                    href="https://maps.app.goo.gl/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="iconCircle">
                      <FaMapMarkerAlt />
                    </span>
                    TOWER-A, 604, Bestech Business Tower, SAS Nagar, Punjab
                    160062
                  </a>
                </li> */}
              </ul>

              <ul className="socialList">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="socialLink"
                    >
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={16}
                        height={16}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>

          <hr className="divider" />

          <div className="bottomBar">
            <p className="m-0">
              © Copyright {currentYear} | <b>STYLEVIN</b> | All right reserved.
            </p>

            <div className="paymentGroup">
              <span className="paymentLabel">100% Secure Payment:</span>
              {paymentBadges.map((badge) => (
                <span key={badge.name} className="paymentBadge">
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    width={44}
                    height={18}
                  />
                </span>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default FooterLayout;