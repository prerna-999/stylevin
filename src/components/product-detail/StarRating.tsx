import React from "react";

interface StarRatingProps {
  value: number; // 0 – max, decimals allowed (4.3 → 4 full + 30% of the 5th)
  max?: number;
  size?: number;
  className?: string;
}

const STAR_PATH =
  "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z";

/** Read-only star row with partial-star fill. */
const StarRating: React.FC<StarRatingProps> = ({ value, max = 5, size = 16, className = "" }) => (
  <span
    className={`pd-stars ${className}`}
    role="img"
    aria-label={`${value.toFixed(1)} out of ${max} stars`}
  >
    {Array.from({ length: max }, (_, i) => {
      const fill = Math.max(0, Math.min(1, value - i));
      return (
        <span key={i} className="pd-stars__star" style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path d={STAR_PATH} className="pd-stars__empty" />
          </svg>
          <span className="pd-stars__fill" style={{ width: `${fill * 100}%` }}>
            <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
              <path d={STAR_PATH} />
            </svg>
          </span>
        </span>
      );
    })}
  </span>
);

export default StarRating;
