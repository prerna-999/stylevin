import React, { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { Product } from "@/types/product";
import { getColorName } from "@/lib/colors";

export type VariantModalMode = "change" | "add";

interface VariantModalProps {
  mode: VariantModalMode;
  product: Product;
  /** the cart line being edited (or used as the starting point when adding) */
  initialSize?: string;
  initialColor?: string;
  /** qty already in the cart for a size + colour (to warn about duplicates) */
  qtyInCart: (size: string, color?: string) => number;
  onConfirm: (size: string, color?: string) => void;
  onClose: () => void;
}

const VariantModal: React.FC<VariantModalProps> = ({
  mode,
  product,
  initialSize,
  initialColor,
  qtyInCart,
  onConfirm,
  onClose,
}) => {
  const [size, setSize] = useState<string | undefined>(
    // in "add" mode start with nothing chosen so the shopper picks a new size
    mode === "change" ? initialSize : undefined
  );
  const [color, setColor] = useState<string | undefined>(
    initialColor ?? product.colors[0]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const existing = size ? qtyInCart(size, color) : 0;
  const unchanged =
    mode === "change" && size === initialSize && color === initialColor;
  const title = mode === "change" ? "Change size & color" : "Add another size / color";
  const cta =
    mode === "change"
      ? "Done"
      : existing > 0
      ? "Add one more"
      : "Add to Cart";

  return (
    <div
      className="cart-modal__overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cart-modal" role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="cart-modal__close" aria-label="Close" onClick={onClose}>
          <FiX />
        </button>

        <h3 className="cart-modal__title">{title}</h3>
        <p className="cart-modal__product">{product.name}</p>

        {product.colors.length > 0 && (
          <div className="cart-modal__section">
            <p className="cart-modal__label">
              Color{color && getColorName(color) ? <span>: {getColorName(color)}</span> : null}
            </p>
            <div className="cart-modal__colors">
              {product.colors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  title={getColorName(hex) ?? hex}
                  aria-label={getColorName(hex) ?? hex}
                  aria-pressed={color === hex}
                  className={`cart-modal__color ${color === hex ? "is-active" : ""}`}
                  style={{ background: hex }}
                  onClick={() => setColor(hex)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="cart-modal__section">
          <p className="cart-modal__label">
            Select Size{size ? <span>: {size}</span> : null}
          </p>
          <div className="cart-modal__sizes">
            {product.variants.map((v) => {
              const inCart = qtyInCart(v.size, color);
              return (
                <button
                  key={v.size}
                  type="button"
                  disabled={v.stock === 0}
                  aria-pressed={size === v.size}
                  className={`cart-modal__size ${size === v.size ? "is-active" : ""}`}
                  onClick={() => setSize(v.size)}
                >
                  {v.size}
                  {inCart > 0 && (
                    <span className="cart-modal__size-tag">In cart · {inCart}</span>
                  )}
                </button>
              );
            })}
          </div>
          {mode === "add" && existing > 0 && (
            <p className="cart-modal__note">
              This size &amp; color is already in your cart ({existing}). Adding will increase its quantity.
            </p>
          )}
        </div>

        <button
          type="button"
          className="cart-modal__confirm"
          disabled={!size || unchanged}
          onClick={() => size && onConfirm(size, color)}
        >
          <FiCheck /> {cta}
        </button>
      </div>
    </div>
  );
};

export default VariantModal;
