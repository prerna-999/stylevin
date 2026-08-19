import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="product-card__image"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

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
            className="product-card__wishlist"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <FiHeart />
          </button>
        </div>

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