
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "react-bootstrap";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  Search,
} from "lucide-react";
import MobileMenu from "./Mobile-Menu";
import HeaderSearch from "./HeaderSearch";
import { useAuth, clearSession } from "@/lib/auth";
import { useCart } from "@/context/CartContext";

const logoSrc = "/assets/img/logo/logo.png";

export type NavChild = { label: string; href: string; image?: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};


export const NAV_ITEMS: NavItem[] = [
  {
    label: "Men",
    href: "/men",
    children: [
      { label: "Shirts", href: "/men/shirts", image: "/assets/img/all-images/categories/men-shirts.svg" },
      { label: "T-Shirts", href: "/men/t-shirts", image: "/assets/img/all-images/categories/men-t-shirts.svg" },
      { label: "Jeans", href: "/men/jeans", image: "/assets/img/all-images/categories/men-jeans.svg" },
      { label: "Jackets", href: "/men/jackets", image: "/assets/img/all-images/categories/men-jackets.svg" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    children: [
      { label: "Dresses", href: "/women/dresses", image: "/assets/img/all-images/categories/women-dresses.svg" },
      { label: "Tops", href: "/women/tops", image: "/assets/img/all-images/categories/women-tops.svg" },
      { label: "Skirts", href: "/women/skirts", image: "/assets/img/all-images/categories/women-skirts.svg" },
      { label: "Ethnic Wear", href: "/women/ethnic-wear", image: "/assets/img/all-images/categories/women-ethnic-wear.svg" },
    ],
  },
  {
    label: "Kids",
    href: "/kids",
    children: [
      { label: "Boys", href: "/kids/boys", image: "/assets/img/all-images/categories/kids-boys.svg" },
      { label: "Girls", href: "/kids/girls", image: "/assets/img/all-images/categories/kids-girls.svg" },
      { label: "Infants", href: "/kids/infants", image: "/assets/img/all-images/categories/kids-infants.svg" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Authentication
  const { user } = useAuth();
  const { count } = useCart();
  const cartLabel = count > 0 ? `Cart, ${count} item${count > 1 ? "s" : ""}` : "Cart";

  const handleLogout = () => {
    clearSession();
  };

  return (
    <header className="stylevin-header">
      <Container>
        <div className="header-grid">

          {/* 0. Hamburger (mobile/tablet only) - left side */}
          <button
            type="button"
            aria-label="Open menu"
            className="hamburger-btn"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} strokeWidth={2} />
          </button>

           <div className="header-logo">
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
          </div>

          {/* 1. Navigation (desktop only) - simple parent categories, no dropdown */}
          <nav className="header-nav" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href || item.children?.[0]?.href || "/"}
                className="nav-link"
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 2. Logo */}
          {/* <div className="header-logo">
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
          </div> */}

          <div className="header-actions">
            <HeaderSearch />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="icon-btn desktop-only"
            >
              <Heart size={20} strokeWidth={2} />
            </Link>

            <span className="icon-divider" />

            <Link
              href="/cart"
              aria-label={cartLabel}
              className="icon-btn desktop-only cart-link"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {count > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <span className="icon-divider" />

            <Link
              href="/profile"
              aria-label="Account"
              className="icon-btn desktop-only"
            >
              <User size={20} strokeWidth={2} />
            </Link>

            {user && (
              <div className="header-user">
                <span className="header-user-name">
                  Hi, {user.name?.split(" ")[0]}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="header-logout"
                >
                  Logout
                </button>
              </div>
            )}

            {/* mobile/tablet only: opens the /search page */}
            <Link
              href="/search"
              aria-label="Search"
              className="icon-btn mobile-search"
            >
              <Search size={22} strokeWidth={2} />
            </Link>

            <Link
              href="/cart"
              aria-label={cartLabel}
              className="icon-btn mobile-cart cart-link"
            >
              <ShoppingBag size={22} strokeWidth={2} />
              {count > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </Container>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
