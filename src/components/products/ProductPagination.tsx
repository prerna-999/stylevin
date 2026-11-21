import React from "react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** e.g. "Showing 13–24 of 86" */
  rangeLabel?: string;
}

/** 1 … 4 5 6 … 20 — stays compact for large catalogs */
const getPageItems = (page: number, total: number): (number | "dots")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | "dots")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) items.push("dots");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("dots");

  items.push(total);
  return items;
};

const ProductPagination: React.FC<ProductPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  rangeLabel,
}) => {
  if (totalPages <= 1) {
    return rangeLabel ? (
      <p className="product-pagination__range">{rangeLabel}</p>
    ) : null;
  }

  return (
    <nav className="product-pagination-wrap" aria-label="Pagination">
      <div className="product-pagination">
        <button
          type="button"
          className="product-pagination__btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          &lsaquo;
        </button>

        {getPageItems(page, totalPages).map((item, i) =>
          item === "dots" ? (
            <span key={`dots-${i}`} className="product-pagination__dots">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`product-pagination__btn ${
                item === page ? "is-active" : ""
              }`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="product-pagination__btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
      </div>

      {rangeLabel && <p className="product-pagination__range">{rangeLabel}</p>}
    </nav>
  );
};

export default ProductPagination;
