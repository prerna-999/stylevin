import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";
import { ComboDeal, comboDiscount, comboHref, formatINR } from "@/lib/combos";

interface ComboCardProps {
  combo: ComboDeal;
}

/** Same look as the /men product card; every click goes to the combo's own page. */
const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const discount = comboDiscount(combo);
  const href = comboHref(combo.slug);

  return (
    <div className="product-card">
      <div className="product-card__media">
        <Link href={href} className="product-card__link">
          <div className="product-card__image-wrap">
            <Image
              src={combo.images[0]}
              alt={combo.alt}
              fill
              className="product-card__image"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        </Link>

        {discount > 0 && (
          <span className="product-card__badge product-card__badge--discount">
            {discount}% OFF
          </span>
        )}

        {discount > 0 && (
          <span className="product-card__discount">{discount}% OFF</span>
        )}

        <div className="product-card__actions">
          <Link href={href} className="product-card__add combo-card__select">
            <FiShoppingBag /> Select Options
          </Link>
        </div>
      </div>

      <Link href={href} className="product-card__link">
        <div className="product-card__info">
          <p className="product-card__name">{combo.title}</p>
          <div className="product-card__price-row">
            <span className="product-card__price">{formatINR(combo.price)}</span>
            {combo.mrp > combo.price && (
              <span className="product-card__mrp">{formatINR(combo.mrp)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ComboCard;
