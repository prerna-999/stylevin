"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
import { NAV_ITEMS } from "./Header";
const logoSrc = "/assets/img/logo/stylevin-logo.png";
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="drawer-header">
          <Link href="/" aria-label="Stylevin home" className="logo-link" onClick={onClose}>
            {logoError ? (
              <span className="logo-fallback">STYLEVIN</span>
            ) : (
              <img
                src={logoSrc}
                alt="Stylevin"
                className="logo-img"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
          <button aria-label="Close menu" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* search row */}
        <div className="drawer-search">
          <Search size={18} color="var(--text-color)" />
          <input type="text" placeholder="Search products..." />
        </div>

        {/* quick action icons */}
        <div className="drawer-quicklinks">
          <Link href="/wishlist" onClick={onClose} className="quicklink-btn">
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>
          <Link href="/cart" onClick={onClose} className="quicklink-btn">
            <ShoppingBag size={20} />
            <span>Cart</span>
          </Link>
          <Link href="/account" onClick={onClose} className="quicklink-btn">
            <User size={20} />
            <span>Account</span>
          </Link>
        </div>

        {/* nav rows */}
        <nav className="drawer-nav">
          {NAV_ITEMS.map((item) => {
            const isOpen = expanded === item.label;
            return (
              <div key={item.label} className="drawer-nav-item">
                <button
                  className="drawer-nav-toggle"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded((prev) => (prev === item.label ? null : item.label))}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown size={18} strokeWidth={2.5} className={`chevron ${isOpen ? "rotated" : ""}`} />
                  )}
                </button>

                {item.children && (
                  <div className={`drawer-nav-children ${isOpen ? "expanded" : ""}`}>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href} onClick={onClose}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="drawer-contact">
          <span>Need help? Call +91 7969328400</span>
        </div>
      </aside>
    </div>
  );
}