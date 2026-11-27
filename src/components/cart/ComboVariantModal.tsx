import React, { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { ComboItem, buildComboKeys, parseComboLine } from "@/lib/combos";
import type { VariantModalMode } from "./VariantModal";

interface ComboVariantModalProps {
  mode: VariantModalMode;
  title: string;
  items: ComboItem[];
  /** current cart line (size / colour-name strings) */
  initialSize?: string;
  initialColorName?: string;
  /** qty already in the cart for this exact selection */
  qtyInCart: (size: string, color: string) => number;
  onConfirm: (sel: { size: string; color: string; colorName: string }) => void;
  onClose: () => void;
}

const ComboVariantModal: React.FC<ComboVariantModalProps> = ({
  mode,
  title: productName,
  items,
  initialSize,
  initialColorName,
  qtyInCart,
  onConfirm,
  onClose,
}) => {
  const parsed = parseComboLine(items, initialSize, initialColorName);
  const [colorIdx, setColorIdx] = useState<number[]>(parsed.colorIdx);
  const [sizes, setSizes] = useState<(string | null)[]>(
    mode === "change"
      ? parsed.sizes
      : // "add": shopper picks fresh sizes (single-size items are preselected)
        items.map((it) => (it.sizes.length === 1 ? it.sizes[0] : null))
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

  const allSized = items.every((_, i) => !!sizes[i]);
  const keys = buildComboKeys(items, colorIdx, sizes);
  const existing = allSized ? qtyInCart(keys.size, keys.color) : 0;
  const unchanged =
    mode === "change" && allSized && keys.size === initialSize && keys.colorName === initialColorName;
  const heading = mode === "change" ? "Change size & color" : "Add another size / color";
  const cta = mode === "change" ? "Done" : existing > 0 ? "Add one more" : "Add to Cart";

  return (
    <div
      className="cart-modal__overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cart-modal" role="dialog" aria-modal="true" aria-label={heading}>
        <button type="button" className="cart-modal__close" aria-label="Close" onClick={onClose}>
          <FiX />
        </button>

        <h3 className="cart-modal__title">{heading}</h3>
        <p className="cart-modal__product">{productName}</p>

        {items.map((item, i) => {
          const ci = colorIdx[i] ?? 0;
          return (
            <div className="cart-modal__group" key={item.label}>
              <h4 className="cart-modal__group-title">{item.label}</h4>

              <div className="cart-modal__section">
                <p className="cart-modal__label">
                  Color<span>: {item.colors[ci].name}</span>
                </p>
                <div className="cart-modal__colors">
                  {item.colors.map((c, k) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={`${item.label} colour ${c.name}`}
                      aria-pressed={k === ci}
                      className={`cart-modal__color ${k === ci ? "is-active" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setColorIdx((prev) => prev.map((v, n) => (n === i ? k : v)))}
                    />
                  ))}
                </div>
              </div>

              <div className="cart-modal__section">
                <p className="cart-modal__label">
                  Select Size{sizes[i] ? <span>: {sizes[i]}</span> : null}
                </p>
                <div className="cart-modal__sizes">
                  {item.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={item.unavailable?.includes(s)}
                      aria-pressed={sizes[i] === s}
                      className={`cart-modal__size ${sizes[i] === s ? "is-active" : ""}`}
                      onClick={() => setSizes((prev) => prev.map((v, n) => (n === i ? s : v)))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {mode === "add" && existing > 0 && (
          <p className="cart-modal__note">
            This combination is already in your cart ({existing}). Adding will increase its quantity.
          </p>
        )}

        <button
          type="button"
          className="cart-modal__confirm"
          disabled={!allSized || unchanged}
          onClick={() => allSized && onConfirm(keys)}
        >
          <FiCheck /> {cta}
        </button>
      </div>
    </div>
  );
};

export default ComboVariantModal;
