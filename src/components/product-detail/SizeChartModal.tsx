import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { SizeChart, inchToCm } from "@/lib/products/sizeChart";

interface SizeChartModalProps {
  open: boolean;
  chart: SizeChart;
  selectedSize: string | null;
  onSelectSize?: (size: string) => void;
  onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  open,
  chart,
  selectedSize,
  onSelectSize,
  onClose,
}) => {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const fmt = (n: number) => (unit === "in" ? n : inchToCm(n));

  return (
    <div className="pd-sizechart" role="dialog" aria-modal="true" aria-labelledby="pd-sizechart-title" onClick={onClose}>
      <div className="pd-sizechart__panel" onClick={(e) => e.stopPropagation()}>
        <div className="pd-sizechart__head">
          <h3 id="pd-sizechart-title">{chart.title}</h3>
          <button type="button" className="pd-sizechart__close" aria-label="Close size chart" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {chart.kind === "one-size" ? (
          <p className="pd-sizechart__note">{chart.note}</p>
        ) : (
          <>
            <div className="pd-sizechart__units" role="group" aria-label="Measurement unit">
              <button type="button" className={unit === "in" ? "is-active" : ""} onClick={() => setUnit("in")}>
                Inches
              </button>
              <button type="button" className={unit === "cm" ? "is-active" : ""} onClick={() => setUnit("cm")}>
                CM
              </button>
            </div>

            <div className="pd-sizechart__table-wrap">
              <table className="pd-sizechart__table">
                <thead>
                  <tr>
                    <th>Size</th>
                    {chart.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row) => (
                    <tr
                      key={row.size}
                      className={selectedSize === row.size ? "is-selected" : ""}
                      onClick={() => onSelectSize?.(row.size)}
                    >
                      <td>{row.size}</td>
                      {row.values.map((v, i) => (
                        <td key={i}>{fmt(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {onSelectSize && <p className="pd-sizechart__tip">Tap a row to select that size.</p>}

            {chart.note && <p className="pd-sizechart__note">{chart.note}</p>}

            {chart.howToMeasure.length > 0 && (
              <div className="pd-sizechart__measure">
                <h4>How to measure</h4>
                <ul>
                  {chart.howToMeasure.map((m) => (
                    <li key={m.label}>
                      <strong>{m.label}:</strong> {m.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SizeChartModal;
