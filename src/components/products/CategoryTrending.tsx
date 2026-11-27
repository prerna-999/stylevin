import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface CategoryTrendingProps {
  title: string;
  products: Product[];
}

/** "Trending now in Men" strip: shown under the filter bar on parent category pages only. */
const CategoryTrending: React.FC<CategoryTrendingProps> = ({
  title,
  products,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="category-trending">
      <h2 className="category-trending__title">{title}</h2>
      <div className="category-trending__track">
        {products.map((product) => (
          <div className="category-trending__item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTrending;
