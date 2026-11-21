import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiCheck,
  FiChevronDown,
  FiHeart,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { TbRuler2 } from "react-icons/tb";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getSizeChart } from "@/lib/products/sizeChart";
import { getColorName } from "@/lib/colors";
import StarRating from "./StarRating";
import SizeChartModal from "./SizeChartModal";

interface ProductInfoProps {
  product: Product;
  reviewCount: number;
  rating: number;
}

const MAX_QTY = 10;

const ProductInfo: React.FC<ProductInfoProps> = ({ product, reviewCount, rating }) => {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors[0]
  );
  const [chartOpen, setChartOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>("details");

  const chart = useMemo(() => getSizeChart(product), [product]);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const inStock = product.variants.filter((v) => v.stock > 0);
  const soldOut = inStock.length === 0;
  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const maxQty = Math.min(selectedVariant?.stock ?? MAX_QTY, MAX_QTY);

  // single-size products ("One Size") are pre-selected
  useEffect(() => {
    setSelectedSize(inStock.length === 1 ? inStock[0].size : null);
    setQty(1);
    setSizeError(false);
    setSelectedColor(product.colors[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // the button turns into "View Cart" once this size + colour is in the cart
  const inCart = selectedSize
    ? isInCart(product.id, selectedSize, selectedColor)
    : false;

  const chooseSize = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    const stock = product.variants.find((v) => v.size === size)?.stock ?? MAX_QTY;
    setQty((q) => Math.min(q, Math.max(1, Math.min(stock, MAX_QTY))));
  };

  const handleAdd = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, { size: selectedSize, qty, color: selectedColor });
  };

  const scrollToReviews = () =>
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const panels = [
    {
      id: "details",
      title: "Product Details",
      body: (
        <>
          <ul className="pd-info__specs">
            {product.code && (
              <li>
                <span>Product Code</span>
                {product.code}
              </li>
            )}
            <li>
              <span>Category</span>
              <span className="pd-info__cap">
                {product.category} / {product.subcategory.replace(/-/g, " ")}
              </span>
            </li>
            <li>
              <span>Available Sizes</span>
              {product.variants.map((v) => v.size).join(", ")}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      body: (
        <ul className="pd-info__list">
          <li>Metro cities: 3–5 business days. Other cities: 5–7 business days.</li>
          <li>Free shipping on prepaid orders above ₹999.</li>
          <li>
            Cash on Delivery available — <Link href="/cod">see COD details</Link>.
          </li>
          <li>
            Easy returns &amp; refunds — <Link href="/returns-refunds">read the policy</Link>.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="pd-info">
      <h1 className="pd-info__name">{product.name}</h1>

      {reviewCount > 0 && (
        <button type="button" className="pd-info__rating" onClick={scrollToReviews}>
          <span className="pd-info__rating-pill">{rating.toFixed(1)} ★</span>
          <StarRating value={rating} size={14} />
          <span className="pd-info__rating-count">{reviewCount} reviews</span>
        </button>
      )}

      <div className="pd-info__price-row">
        <span className="pd-info__price">₹{product.price}</span>
        {product.mrp > product.price && (
          <>
            <span className="pd-info__mrp">MRP ₹{product.mrp}</span>
            <span className="pd-info__discount">{discount}% OFF</span>
          </>
        )}
      </div>
      <p className="pd-info__tax">Inclusive of all taxes</p>

      <p className="pd-info__desc">{product.description}</p>

      {/* ---------- colour ---------- */}
      {product.colors.length > 0 && (
        <>
          <p className="pd-info__label">
            Color
            {selectedColor && getColorName(selectedColor) && (
              <span>: {getColorName(selectedColor)}</span>
            )}
          </p>
          <div className="pd-info__colors">
            {product.colors.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={getColorName(hex) ?? hex}
                aria-pressed={selectedColor === hex}
                title={getColorName(hex) ?? hex}
                className={`pd-info__color ${
                  selectedColor === hex ? "is-active" : ""
                }`}
                style={{ background: hex }}
                onClick={() => setSelectedColor(hex)}
              />
            ))}
          </div>
        </>
      )}

      {/* ---------- size ---------- */}
      <div className="pd-info__size-head">
        <p className="pd-info__label">
          Select Size {selectedSize && <span>: {selectedSize}</span>}
        </p>
        <button type="button" className="pd-info__chart-link" onClick={() => setChartOpen(true)}>
          <TbRuler2 /> Size Chart
        </button>
      </div>

      <div className={`pd-info__sizes ${sizeError ? "has-error" : ""}`}>
        {product.variants.map((v) => (
          <button
            key={v.size}
            type="button"
            disabled={v.stock === 0}
            aria-pressed={selectedSize === v.size}
            className={`pd-info__size ${selectedSize === v.size ? "is-active" : ""}`}
            onClick={() => chooseSize(v.size)}
          >
            {v.size}
            {v.stock > 0 && v.stock <= 5 && <span className="pd-info__size-dot" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {sizeError && <p className="pd-info__error">Please select a size to continue.</p>}
      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
        <p className="pd-info__stock">Hurry! Only {selectedVariant.stock} left in this size.</p>
      )}

      {/* ---------- quantity ---------- */}
      {!soldOut && (
        <div className="pd-info__qty-row">
          <p className="pd-info__label">Quantity</p>
          <div className="pd-info__qty">
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>
              <FiMinus />
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)}>
              <FiPlus />
            </button>
          </div>
        </div>
      )}

      {/* ---------- CTAs ---------- */}
      <div className="pd-info__ctas">
        <button
          type="button"
          className={`pd-info__add ${inCart ? "is-added" : ""}`}
          onClick={handleAdd}
          disabled={soldOut}
        >
          {soldOut ? (
            "OUT OF STOCK"
          ) : inCart ? (
            <>
              <FiCheck /> VIEW CART
            </>
          ) : (
            <>
              <FiShoppingBag /> ADD TO CART
            </>
          )}
        </button>
        <button
          type="button"
          className={`pd-info__save ${saved ? "is-active" : ""}`}
          aria-pressed={saved}
          onClick={() => toggle(product.id)}
        >
          <FiHeart /> {saved ? "SAVED" : "SAVE FOR LATER"}
        </button>
      </div>
      {saved && (
        <p className="pd-info__saved-note">
          Saved to your list. <Link href="/wishlist">View saved items</Link>
        </p>
      )}

      {/* ---------- perks ---------- */}
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

      {/* ---------- accordion ---------- */}
      <div className="pd-info__accordion">
        {panels.map((p) => {
          const isOpen = openPanel === p.id;
          return (
            <div key={p.id} className={`pd-info__panel ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="pd-info__panel-head"
                aria-expanded={isOpen}
                onClick={() => setOpenPanel(isOpen ? null : p.id)}
              >
                {p.title}
                <FiChevronDown />
              </button>
              {isOpen && <div className="pd-info__panel-body">{p.body}</div>}
            </div>
          );
        })}
      </div>

      <SizeChartModal
        open={chartOpen}
        chart={chart}
        selectedSize={selectedSize}
        onSelectSize={(s) => {
          const v = product.variants.find((x) => x.size === s);
          if (v && v.stock > 0) {
            chooseSize(s);
            setChartOpen(false);
          }
        }}
        onClose={() => setChartOpen(false)}
      />
    </div>
  );
};

export default ProductInfo;
