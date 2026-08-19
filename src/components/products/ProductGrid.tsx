import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = "No products found in this category yet.",
}) => {
  if (products.length === 0) {
    return <p className="product-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;