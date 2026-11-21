import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FiChevronDown,
  FiHeart,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useCart, CartItem, MAX_QTY_PER_LINE } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/lib/auth";
import { dummyProducts } from "@/data/dummyProducts";
import { getColorName } from "@/lib/colors";
import { Product } from "@/types/product";
import CartBanner from "./CartBanner";
import VariantModal, { VariantModalMode } from "./VariantModal";

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** orders at or above this amount ship free (matches the product page copy) */
const FREE_SHIPPING_FROM = 999;

const lineKey = (i: CartItem) => `${i.id}|${i.size ?? ""}|${i.color ?? ""}`;

interface ModalState {
  mode: VariantModalMode;
  item: CartItem;
  product: Product;
}

const CartPage: React.FC = () => {
  const {
    items,
    count,
    subtotal,
    savings,
    ready,
    updateQty,
    removeItem,
    changeVariant,
    addItem,
    clear,
  } = useCart();
  const { has: isSaved, toggle: toggleSaved } = useWishlist();
  const [modal, setModal] = useState<ModalState | null>(null);
  const router = useRouter();
  const { user, ready: authReady } = useAuth();

  // logged in -> checkout; otherwise login/signup, which sends them back to /checkout afterwards
  const placeOrder = () => {
    if (user) router.push("/checkout");
    else router.push("/profile?redirect=" + encodeURIComponent("/checkout"));
  };

  const catalog = useMemo(() => {
    const map = new Map<number, Product>();
    dummyProducts.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // keep every size / colour of the same product next to each other
  const ordered = useMemo(() => {
    const groups = new Map<number, CartItem[]>();
    items.forEach((i) => {
      const g = groups.get(i.id);
      if (g) g.push(i);
      else groups.set(i.id, [i]);
    });
    return Array.from(groups.values()).flatMap((g) =>
      g.map((item, idx) => ({ item, isLastInGroup: idx === g.length - 1 }))
    );
  }, [items]);

  const qtyInCart = (productId: number) => (size: string, color?: string) =>
    items.find(
      (i) => i.id === productId && i.size === size && i.color === color
    )?.qty ?? 0;

  const moveToWishlist = (item: CartItem) => {
    if (!isSaved(item.id)) toggleSaved(item.id);
    removeItem(item.id, item.size, item.color);
  };

  // wait for the saved cart to load so "empty" never flashes
  if (!ready) {
    return (
      <>
        <CartBanner />
        <div className="cart-page" aria-busy="true" />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <CartBanner />
        {/* same empty state as the wishlist page */}
        <div className="fav-grid" style={{ display: "block", textAlign: "center" }}>
          <p>Your cart is empty.</p>
          <Link href="/men" className="acc-btn">
            Shop Now
          </Link>
        </div>
      </>
    );
  }

  const freeShipping = subtotal >= FREE_SHIPPING_FROM;
  const remaining = FREE_SHIPPING_FROM - subtotal;

  return (
    <>
      <CartBanner />

      <div className="cart-page">
        <div className="cart-layout">
          {/* ---------- items ---------- */}
          <section className="cart-items" aria-label="Cart items">
            <div className="cart-items__head">
              <h2>
                {count} {count === 1 ? "item" : "items"}
              </h2>
              <button type="button" className="cart-link-btn" onClick={clear}>
                Clear cart
              </button>
            </div>

            <ul className="cart-list">
              {ordered.map(({ item, isLastInGroup }) => {
                const product = catalog.get(item.id);
                const max = item.maxQty ?? MAX_QTY_PER_LINE;
                const colorName = item.colorName ?? getColorName(item.color);
                const lineTotal = item.price * item.qty;
                const canEdit = !!product;
                const open = (mode: VariantModalMode) =>
                  product && setModal({ mode, item, product });

                return (
                  <li key={lineKey(item)} className="cart-item">
                    <Link
                      href={item.slug.startsWith("combo-") ? "/#combo-offers" : `/product/${item.slug}`}
                      className="cart-item__image"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 90px, 120px"
                      />
                    </Link>

                    <div className="cart-item__body">
                      <Link
                        href={item.slug.startsWith("combo-") ? "/#combo-offers" : `/product/${item.slug}`}
                        className="cart-item__name"
                      >
                        {item.name}
                      </Link>

                      <div className="cart-item__price">
                        <strong>{rupee(item.price)}</strong>
                        {item.mrp > item.price && (
                          <>
                            <s>{rupee(item.mrp)}</s>
                            <em>
                              {Math.round(
                                ((item.mrp - item.price) / item.mrp) * 100
                              )}
                              % OFF
                            </em>
                          </>
                        )}
                      </div>

                      {/* Myntra-style selectors */}
                      <div className="cart-item__chips">
                        {item.size && (
                          <button
                            type="button"
                            className="cart-chip"
                            disabled={!canEdit}
                            onClick={() => open("change")}
                            aria-label={`Change size, currently ${item.size}`}
                          >
                            Size: <b>{item.size}</b> <FiChevronDown />
                          </button>
                        )}
                        {item.color && (
                          <button
                            type="button"
                            className="cart-chip"
                            disabled={!canEdit}
                            onClick={() => open("change")}
                            aria-label={`Change color, currently ${colorName ?? item.color}`}
                          >
                            Color:
                            <i
                              className="cart-item__swatch"
                              style={{ background: item.color }}
                              aria-hidden="true"
                            />
                            <b>{colorName ?? ""}</b> <FiChevronDown />
                          </button>
                        )}
                        <label className="cart-chip cart-chip--select">
                          Qty:
                          <select
                            value={item.qty}
                            aria-label={`Quantity of ${item.name}`}
                            onChange={(e) =>
                              updateQty(
                                item.id,
                                item.size,
                                item.color,
                                Number(e.target.value)
                              )
                            }
                          >
                            {Array.from({ length: max }, (_, n) => n + 1).map(
                              (n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              )
                            )}
                          </select>
                          <FiChevronDown />
                        </label>
                      </div>

                      <div className="cart-item__actions">
                        <button
                          type="button"
                          className="cart-link-btn"
                          onClick={() => moveToWishlist(item)}
                        >
                          <FiHeart /> Move to Wishlist
                        </button>
                        {canEdit && isLastInGroup && (
                          <button
                            type="button"
                            className="cart-link-btn cart-link-btn--accent"
                            onClick={() => open("add")}
                          >
                            <FiPlus /> Add another size / color
                          </button>
                        )}
                      </div>

                      {item.qty >= max && (
                        <p className="cart-item__note">
                          Maximum available quantity added.
                        </p>
                      )}
                    </div>

                    <div className="cart-item__side">
                      <button
                        type="button"
                        className="cart-item__remove"
                        aria-label={`Remove ${item.name}${
                          item.size ? `, size ${item.size}` : ""
                        }`}
                        onClick={() =>
                          removeItem(item.id, item.size, item.color)
                        }
                      >
                        <FiX />
                      </button>
                      <div className="cart-item__total">{rupee(lineTotal)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link href="/men" className="cart-continue">
              ← Continue shopping
            </Link>
          </section>

          {/* ---------- price details ---------- */}
          <aside className="cart-summary" aria-label="Price details">
            <h2>Price Details</h2>

            <dl>
              <div>
                <dt>
                  Total MRP ({count} {count === 1 ? "item" : "items"})
                </dt>
                <dd>{rupee(subtotal + savings)}</dd>
              </div>
              {savings > 0 && (
                <div className="cart-summary__save">
                  <dt>Discount on MRP</dt>
                  <dd>− {rupee(savings)}</dd>
                </div>
              )}
              <div>
                <dt>Shipping</dt>
                <dd>{freeShipping ? "Free" : "Calculated at checkout"}</dd>
              </div>
              <div className="cart-summary__total">
                <dt>Total Amount</dt>
                <dd>{rupee(subtotal)}</dd>
              </div>
            </dl>

            {!freeShipping && (
              <p className="cart-summary__hint">
                Add {rupee(remaining)} more for free shipping on prepaid orders.
              </p>
            )}
            {savings > 0 && (
              <p className="cart-summary__saved">
                You&apos;ll save {rupee(savings)} on this order.
              </p>
            )}
            <p className="cart-summary__hint">Inclusive of all taxes.</p>

            <button
              type="button"
              className="cart-place-order"
              onClick={placeOrder}
              disabled={!authReady}
            >
              Place Order
            </button>
            {authReady && !user && (
              <p className="cart-summary__hint cart-place-order__note">
                You&apos;ll be asked to log in or sign up first. Your cart stays saved.
              </p>
            )}
          </aside>
        </div>
      </div>

      {modal && (
        <VariantModal
          key={`${modal.mode}|${lineKey(modal.item)}`}
          mode={modal.mode}
          product={modal.product}
          initialSize={modal.item.size}
          initialColor={modal.item.color}
          qtyInCart={qtyInCart(modal.product.id)}
          onClose={() => setModal(null)}
          onConfirm={(size, color) => {
            if (modal.mode === "change") {
              changeVariant(
                modal.product,
                { size: modal.item.size, color: modal.item.color },
                { size, color }
              );
            } else {
              addItem(modal.product, {
                size,
                color,
                image: modal.item.image,
              });
            }
            setModal(null);
          }}
        />
      )}
    </>
  );
};

export default CartPage;
