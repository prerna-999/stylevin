import React from "react";
import Link from "next/link";
import { CategoryConfig } from "@/lib/categories";

interface CategoryPillsProps {
  categoryConfig: CategoryConfig;
  activeSubcategory?: string;
}

/** Pill row: All · Shirts · T-Shirts · Jeans · Jackets (real links → own URL each) */
const CategoryPills: React.FC<CategoryPillsProps> = ({
  categoryConfig,
  activeSubcategory,
}) => (
  <nav className="category-pills" aria-label="Categories">
    <Link
      href={`/${categoryConfig.slug}`}
      className={`category-pills__pill ${!activeSubcategory ? "is-active" : ""}`}
    >
      All
    </Link>
    {categoryConfig.subcategories.map((sub) => (
      <Link
        key={sub.slug}
        href={`/${categoryConfig.slug}/${sub.slug}`}
        className={`category-pills__pill ${
          activeSubcategory === sub.slug ? "is-active" : ""
        }`}
      >
        {sub.label}
      </Link>
    ))}
  </nav>
);

export default CategoryPills;
