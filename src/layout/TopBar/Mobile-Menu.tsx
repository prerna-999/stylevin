
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Heart, ShoppingBag, User } from "lucide-react";
import { NAV_ITEMS, type NavChild } from "./Header";
import { useCart } from "@/context/CartContext";
const logoSrc = "/assets/img/logo/logo.png";
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};
function CategoryTile({ child, onClick }: { child: NavChild; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const showImg = !!child.image && !imgError;
  return (
    <Link href={child.href} onClick={onClick} className="drawer-cat-tile">
      <span className="drawer-cat-thumb">
        {showImg ? (
          <img
            src={child.image}
            alt={child.label}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="drawer-cat-initial" aria-hidden="true">
            {child.label.charAt(0)}
          </span>
        )}
      </span>
      <span className="drawer-cat-label">{child.label}</span>
    </Link>
  );
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    if (!open) setActiveLabel(null); 
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

        {/* quick action icons */}
        <div className="drawer-quicklinks">
          <Link href="/wishlist" onClick={onClose} className="quicklink-btn">
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>
          <Link href="/cart" onClick={onClose} className="quicklink-btn">
            <ShoppingBag size={20} />
            <span>Cart{count > 0 ? ` (${count})` : ""}</span>
          </Link>
          <Link href="/profile" onClick={onClose} className="quicklink-btn">
            <User size={20} />
            <span>Account</span>
          </Link>
        </div>

        {/* parent categories as tabs */}
        <div className="drawer-tabs" role="tablist" aria-label="Categories">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              id={`drawer-tab-${item.label}`}
              aria-selected={activeLabel === item.label}
              aria-controls={`drawer-panel-${item.label}`}
              className={`drawer-tab ${activeLabel === item.label ? "active" : ""}`}
              onClick={() =>
                setActiveLabel((prev) => (prev === item.label ? null : item.label))
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* sub categories of the selected parent */}
        <nav className="drawer-nav" aria-label="Sub categories">
          {NAV_ITEMS.filter((item) => activeLabel && item.label === activeLabel).map((item) => (
            <div
              key={item.label}
              role="tabpanel"
              id={`drawer-panel-${item.label}`}
              aria-labelledby={`drawer-tab-${item.label}`}
              className="drawer-cat-panel"
            >
              <div className="drawer-cat-grid">
                {item.children?.map((child) => (
                  <CategoryTile key={child.label} child={child} onClick={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="drawer-contact">
          <span>Need help? Call +91 7969328400</span>
        </div>
      </aside>
    </div>
  );
}