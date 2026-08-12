"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu } from "lucide-react";
import MobileMenu from "./Mobile-Menu";
const logoSrc = "/assets/img/logo/stylevin-logo.png";

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Men",
    href: "/men",
    children: [
      { label: "Shirts", href: "/men/shirts" },
      { label: "T-Shirts", href: "/men/t-shirts" },
      { label: "Jeans", href: "/men/jeans" },
      { label: "Jackets", href: "/men/jackets" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    children: [
      { label: "Dresses", href: "/women/dresses" },
      { label: "Tops", href: "/women/tops" },
      { label: "Skirts", href: "/women/skirts" },
      { label: "Ethnic Wear", href: "/women/ethnic-wear" },
    ],
  },
  {
    label: "Kids",
    href: "/kids",
    children: [
      { label: "Boys", href: "/kids/boys" },
      { label: "Girls", href: "/kids/girls" },
      { label: "Infants", href: "/kids/infants" },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    children: [
      { label: "Bags", href: "/accessories/bags" },
      { label: "Watches", href: "/accessories/watches" },
      { label: "Jewellery", href: "/accessories/jewellery" },
      { label: "Belts", href: "/accessories/belts" },
    ],
  },
  {
    label: "Page",
    href: "/page",
    children: [
      { label: "About Us", href: "/page/about-us" },
      { label: "Contact Us", href: "/page/contact-us" },
      { label: "FAQs", href: "/page/faqs" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="stylevin-header">
      <Container>
        <Row className="justify-content-between align-items-center">
          {/* Logo */}
          <Col xs="auto" className="logo-col">
            <Link href="/" aria-label="Stylevin home" className="logo-link">
              {logoError ? (
                <span className="logo-fallback">STYLEVIN</span>
              ) : (
                <Image
                  src={logoSrc}
                  alt="Stylevin"
                  className="logo-img"
                  width={160}
                  height={40}
                  priority
                  onError={() => setLogoError(true)}
                />
              )}
            </Link>
          </Col>

          {/* ---- Nav menus ---- */}
          <Col as="nav" className="col-nav">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="nav-item">
                <Link href={item.href} className="nav-link">
                  <span className="nav-label">{item.label}</span>
                  {item.children && <ChevronDown size={15} strokeWidth={2.5} className="chevron" />}
                </Link>

                {item.children && (
                  <div className="nav-dropdown">
                    {item.children.map((child) => (
                      <Link key={child.label} href={child.href}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Col>

          {/* ---- Icons ---- */}
          <Col xs="auto" className="col-icons">
            <Link href="/search" aria-label="Search" className="icon-btn desktop-only">
              <Search size={20} strokeWidth={2} />
            </Link>
            <span className="icon-divider" />
            <Link href="/wishlist" aria-label="Wishlist" className="icon-btn desktop-only">
              <Heart size={20} strokeWidth={2} />
            </Link>
            <span className="icon-divider" />
            <Link href="/cart" aria-label="Cart" className="icon-btn desktop-only">
              <ShoppingBag size={20} strokeWidth={2} />
            </Link>
            <span className="icon-divider" />
            <Link href="/account" aria-label="Account" className="icon-btn desktop-only">
              <User size={20} strokeWidth={2} />
            </Link>

            <button aria-label="Open menu" className="hamburger-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={24} strokeWidth={2} />
            </button>
          </Col>
        </Row>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}