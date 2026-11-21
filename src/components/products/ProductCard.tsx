import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingBag, FiCheck, FiX } from "react-icons/fi";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { inStockSizes } from "@/lib/products/listing";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [pickingSize, setPickingSize] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );
  const sizes = inStockSizes(product);
  const soldOut = sizes.length === 0;
  const wished = has(product.id);

  const addToCart = (size?: string) => {
    addItem(product, size);
    setPickingSize(false);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  const handleQuickAdd = () => {
    if (sizes.length > 1) setPickingSize(true); // let the shopper choose
    else addToCart(sizes[0]); // single size ("One Size") → add straight away
  };

  return (
    <div className="product-card">
      <div className="product-card__media">
        <Link href={`/product/${product.slug}`} className="product-card__link">
          <div className="product-card__image-wrap">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="product-card__image"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        </Link>

        {product.isNew && (
          <span className="product-card__badge product-card__badge--new">
            NEW
          </span>
        )}
        {!product.isNew && discount > 0 && (
          <span className="product-card__badge product-card__badge--discount">
            {discount}% OFF
          </span>
        )}

        <button
          type="button"
          className={`product-card__wishlist ${wished ? "is-active" : ""}`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => toggle(product.id)}
        >
          <FiHeart />
        </button>

        {/* mobile only: discount label sits where Add to Cart is on desktop */}
        {discount > 0 && (
          <span className="product-card__discount">{discount}% OFF</span>
        )}

        {/* quick add — slides up over the image on hover (always visible on touch) */}
        <div
          className={`product-card__actions ${
            pickingSize || added ? "is-open" : ""
          }`}
        >
          {pickingSize ? (
            <div className="product-card__sizes">
              <div className="product-card__sizes-head">
                <span>Select size</span>
                <button
                  type="button"
                  className="product-card__sizes-close"
                  aria-label="Cancel"
                  onClick={() => setPickingSize(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className="product-card__sizes-list">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="product-card__size"
                    onClick={() => addToCart(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`product-card__add ${added ? "is-added" : ""}`}
              onClick={handleQuickAdd}
              disabled={added || soldOut}
            >
              {soldOut ? (
                "Out of stock"
              ) : added ? (
                <>
                  <FiCheck /> Added
                </>
              ) : (
                <>
                  <FiShoppingBag /> Add to Cart
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__info">
          <p className="product-card__name">{product.name}</p>
          <div className="product-card__price-row">
            <span className="product-card__price">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="product-card__mrp">₹{product.mrp}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
