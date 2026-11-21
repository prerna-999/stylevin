import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ProductBanner from "@/components/products/ProductBanner";
import ProductListing from "@/components/products/ProductListing";
import { CATEGORIES, getCategoryConfig, CategoryConfig } from "@/lib/categories";
import { getProducts } from "@/lib/products/getProducts";
import { Product } from "@/types/product";

interface SubcategoryPageProps {
  category: string;
  subcategory: string;
  categoryConfig: CategoryConfig;
  subcategoryLabel: string;
  initialProducts: Product[];
}

const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  categoryConfig,
  subcategory,
  subcategoryLabel,
  initialProducts,
}) => {
  return (
    <>
      <ProductBanner
        title={subcategoryLabel}
        crumbs={["Home", categoryConfig.label, subcategoryLabel]}
      />

      {/* key → filters / sort / page reset when the shopper switches category */}
      <ProductListing
        key={`${category}/${subcategory}`}
        products={initialProducts}
        categoryConfig={categoryConfig}
        activeSubcategory={subcategory}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = CATEGORIES.flatMap((c) =>
    c.subcategories.map((s) => ({
      params: { category: c.slug, subcategory: s.slug },
    }))
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const category = context.params?.category as string;
  const subcategory = context.params?.subcategory as string;
  const categoryConfig = getCategoryConfig(category);
  const subcategoryConfig = categoryConfig?.subcategories.find(
    (s) => s.slug === subcategory
  );

  if (!categoryConfig || !subcategoryConfig) {
    return { notFound: true };
  }

  const { products } = await getProducts({
    category,
    subcategory,
    perPage: 100,
  });

  return {
    props: {
      category,
      subcategory,
      categoryConfig,
      subcategoryLabel: subcategoryConfig.label,
      initialProducts: products,
    },
  };
};

export default SubcategoryPage;
