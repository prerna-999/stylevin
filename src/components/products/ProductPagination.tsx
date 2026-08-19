import React from "react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
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

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`product-pagination__btn ${
            p === page ? "is-active" : ""
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

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
  );
};

export default ProductPagination;