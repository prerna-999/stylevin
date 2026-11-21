// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
// import { NAV_ITEMS } from "./Header";
// import { useCart } from "@/context/CartContext";
// const logoSrc = "/assets/img/logo/stylevin-logo.png";
// type MobileMenuProps = {
//   open: boolean;
//   onClose: () => void;
// };
// export default function MobileMenu({ open, onClose }: MobileMenuProps) {
//   const [expanded, setExpanded] = useState<string | null>(null);
//   const [logoError, setLogoError] = useState(false);
//   const { count } = useCart();

//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open]);
//   return (
//     <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
//       <div className="backdrop" onClick={onClose} />
//       <aside className="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
//         <div className="drawer-header">
//           <Link href="/" aria-label="Stylevin home" className="logo-link" onClick={onClose}>
//             {logoError ? (
//               <span className="logo-fallback">STYLEVIN</span>
//             ) : (
//               <img
//                 src={logoSrc}
//                 alt="Stylevin"
//                 className="logo-img"
//                 onError={() => setLogoError(true)}
//               />
//             )}
//           </Link>
//           <button aria-label="Close menu" className="close-btn" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         {/* search row */}
//         <div className="drawer-search">
//           <Search size={18} color="var(--text-color)" />
//           <input type="text" placeholder="Search products..." />
//         </div>

//         {/* quick action icons */}
//         <div className="drawer-quicklinks">
//           <Link href="/wishlist" onClick={onClose} className="quicklink-btn">
//             <Heart size={20} />
//             <span>Wishlist</span>
//           </Link>
//           <Link href="/cart" onClick={onClose} className="quicklink-btn">
//             <ShoppingBag size={20} />
//             <span>Cart{count > 0 ? ` (${count})` : ""}</span>
//           </Link>
//           <Link href="/account" onClick={onClose} className="quicklink-btn">
//             <User size={20} />
//             <span>Account</span>
//           </Link>
//         </div>

//         {/* nav rows */}
//         <nav className="drawer-nav">
//           {NAV_ITEMS.map((item) => {
//             const isOpen = expanded === item.label;
//             return (
//               <div key={item.label} className="drawer-nav-item">
//                 <button
//                   className="drawer-nav-toggle"
//                   aria-expanded={isOpen}
//                   onClick={() => setExpanded((prev) => (prev === item.label ? null : item.label))}
//                 >
//                   {item.label}
//                   {item.children && (
//                     <ChevronDown size={18} strokeWidth={2.5} className={`chevron ${isOpen ? "rotated" : ""}`} />
//                   )}
//                 </button>

//                 {item.children && (
//                   <div className={`drawer-nav-children ${isOpen ? "expanded" : ""}`}>
//                     <ul>
//                       {item.children.map((child) => (
//                         <li key={child.label}>
//                           <Link href={child.href} onClick={onClose}>
//                             {child.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         <div className="drawer-contact">
//           <span>Need help? Call +91 7969328400</span>
//         </div>
//       </aside>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
import { NAV_ITEMS } from "./Header";
import { useCart } from "@/context/CartContext";
const logoSrc = "/assets/img/logo/stylevin-logo.png";
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const { count } = useCart();
  const router = useRouter();
  const [term, setTerm] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

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
        <form className="drawer-search" role="search" onSubmit={submitSearch}>
          <button type="submit" aria-label="Search" style={{ background: "none", border: 0, padding: 0, display: "inline-flex" }}>
            <Search size={18} color="var(--text-color)" />
          </button>
          <input
            type="search"
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            enterKeyHint="search"
            aria-label="Search products"
          />
        </form>

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

        {/* nav rows */}
        <nav className="drawer-nav">
          {NAV_ITEMS.map((item) => {
            const isOpen = expanded === item.label;
            const hasChildren = !!item.children?.length;
            const toggle = () =>
              setExpanded((prev) => (prev === item.label ? null : item.label));

            return (
              <div key={item.label} className="drawer-nav-item">
                <div className="drawer-nav-row">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="drawer-nav-link"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="drawer-nav-link drawer-nav-label-btn"
                      onClick={toggle}
                    >
                      {item.label}
                    </button>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      className="drawer-nav-toggle"
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={isOpen}
                      onClick={toggle}
                    >
                      <ChevronDown
                        size={18}
                        strokeWidth={2.5}
                        className={`chevron ${isOpen ? "rotated" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div className={`drawer-nav-children ${isOpen ? "expanded" : ""}`}>
                    <ul>
                      {item.children!.map((child) => (
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