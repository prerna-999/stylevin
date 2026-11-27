import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiCheck,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ComboCard from "./ComboCard";
import { useCart, MAX_QTY_PER_LINE } from "@/context/CartContext";
import {
  COMBO_DEALS,
  COMBO_ID_BASE,
  COMBO_ITEMS,
  ComboDeal,
  buildComboKeys,
  comboDiscount,
  comboToProduct,
  formatINR,
} from "@/lib/combos";

interface ComboDetailProps {
  combo: ComboDeal;
}

const ComboDetail: React.FC<ComboDetailProps> = ({ combo }) => {
  const router = useRouter();
  const { addItem, isInCart } = useCart();

  const items = COMBO_ITEMS[combo.id] ?? [];
  const discount = comboDiscount(combo);
  const productId = COMBO_ID_BASE + combo.id;

  const [colorIdx, setColorIdx] = useState<number[]>(items.map(() => 0));
  const [sizes, setSizes] = useState<(string | null)[]>(
    items.map((it) => (it.sizes.length === 1 ? it.sizes[0] : null))
  );
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  // start fresh when the shopper moves to another combo
  useEffect(() => {
    setColorIdx(items.map(() => 0));
    setSizes(items.map((it) => (it.sizes.length === 1 ? it.sizes[0] : null)));
    setQty(1);
    setSizeError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo.id]);

  const allSized = items.length > 0 && items.every((_, i) => !!sizes[i]);
  const keys = useMemo(
    () => buildComboKeys(items, colorIdx, sizes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo.id, colorIdx, sizes]
  );
  const inCart = allSized && isInCart(productId, keys.size, keys.color);

  const handleAdd = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    if (!allSized) {
      setSizeError(true);
      return;
    }
    addItem(comboToProduct(combo), {
      size: keys.size,
      color: keys.color,
      colorName: keys.colorName,
      qty,
    });
  };

  const more = COMBO_DEALS.filter((c) => c.id !== combo.id).slice(0, 4);

  return (
    <>
      <Head>
        <title>{`${combo.title} | Combo Offers | STYLEVIN`}</title>
        <meta name="description" content={combo.description} />
      </Head>

      <section className="pd-page">
        <nav className="pd-page__crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <FiChevronRight />
          <Link href="/combo-offers">Combo Offers</Link>
          <FiChevronRight />
          <span aria-current="page">{combo.title}</span>
        </nav>

        <div className="pd-page__inner">
          <ProductGallery
            productId={productId}
            images={combo.images}
            name={combo.title}
            discount={discount}
            showWishlist={false}
          />

          <div className="pd-info">
            <h1 className="pd-info__name">{combo.title}</h1>

            <div className="pd-info__price-row">
              <span className="pd-info__price">{formatINR(combo.price)}</span>
              {combo.mrp > combo.price && (
                <>
                  <span className="pd-info__mrp">MRP {formatINR(combo.mrp)}</span>
                  <span className="pd-info__discount">{discount}% OFF</span>
                </>
              )}
            </div>
            <p className="pd-info__tax">
              Inclusive of all taxes · You save {formatINR(combo.mrp - combo.price)}
            </p>

            <p className="pd-info__desc">{combo.description}</p>

            <p className="combo-pd__includes">
              Includes {items.length} items:{" "}
              <strong>{items.map((it) => it.label).join(" + ")}</strong>
            </p>

            {/* ---------- colour + size, one block per item ---------- */}
            {items.map((item, i) => (
              <div className="combo-pd__item" key={`${combo.id}-${item.label}`}>
                <h2 className="combo-pd__item-title">{item.label}</h2>

                <p className="pd-info__label">
                  Color<span>: {item.colors[colorIdx[i] ?? 0].name}</span>
                </p>
                <div className="pd-info__colors">
                  {item.colors.map((color, ci) => (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      aria-label={`${item.label} colour ${color.name}`}
                      aria-pressed={ci === (colorIdx[i] ?? 0)}
                      className={`pd-info__color ${ci === (colorIdx[i] ?? 0) ? "is-active" : ""}`}
                      style={{ background: color.hex }}
                      onClick={() =>
                        setColorIdx((prev) => prev.map((v, k) => (k === i ? ci : v)))
                      }
                    />
                  ))}
                </div>

                <p className="pd-info__label">
                  Select Size{sizes[i] && <span>: {sizes[i]}</span>}
                </p>
                <div className={`pd-info__sizes ${sizeError && !sizes[i] ? "has-error" : ""}`}>
                  {item.sizes.map((size) => {
                    const available = !item.unavailable?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        aria-pressed={sizes[i] === size}
                        className={`pd-info__size ${sizes[i] === size ? "is-active" : ""}`}
                        onClick={() => {
                          setSizes((prev) => prev.map((v, k) => (k === i ? size : v)));
                          setSizeError(false);
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {sizeError && (
              <p className="pd-info__error" role="alert">
                Please select a size for every item to continue.
              </p>
            )}

            {/* ---------- quantity ---------- */}
            <div className="pd-info__qty-row">
              <p className="pd-info__label">Quantity</p>
              <div className="pd-info__qty">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => q - 1)}
                >
                  <FiMinus />
                </button>
                <span aria-live="polite">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={qty >= MAX_QTY_PER_LINE}
                  onClick={() => setQty((q) => q + 1)}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* ---------- CTA ---------- */}
            <div className="pd-info__ctas">
              <button
                type="button"
                className={`pd-info__add ${inCart ? "is-added" : ""}`}
                onClick={handleAdd}
              >
                {inCart ? (
                  <>
                    <FiCheck /> VIEW CART
                  </>
                ) : (
                  <>
                    <FiShoppingBag /> ADD COMBO TO CART
                  </>
                )}
              </button>
            </div>

            <ul className="pd-info__perks">
              <li>
                <FiTruck /> Free shipping on prepaid orders above ₹999
              </li>
              <li>
                <FiRefreshCw /> Easy returns &amp; refunds
              </li>
              <li>
                <FiShield /> 100% secure payment · COD available
              </li>
            </ul>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="pd-recs">
          <div className="pd-recs__inner">
            <div className="pd-recs__head combo-recs__head">
              <h2>More Combo Offers</h2>
              <Link href="/combo-offers" className="combo-view-all__btn">
                View all combos
              </Link>
            </div>
            <div className="product-grid">
              {more.map((c) => (
                <ComboCard key={c.id} combo={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ComboDetail;
