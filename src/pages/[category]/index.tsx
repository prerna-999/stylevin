import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ProductBanner from "@/components/products/ProductBanner";
import ProductListing from "@/components/products/ProductListing";
import { CATEGORIES, getCategoryConfig, CategoryConfig } from "@/lib/categories";
import { getProducts } from "@/lib/products/getProducts";
import { Product } from "@/types/product";

interface CategoryPageProps {
  category: string;
  categoryConfig: CategoryConfig;
  initialProducts: Product[];
  initialTotal: number;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  categoryConfig,
  initialProducts,
}) => {
  return (
    <>
      <ProductBanner
        title={categoryConfig.label}
        crumbs={["Home", categoryConfig.label]}
      />

      <ProductListing
        key={category}
        products={initialProducts}
        categoryConfig={categoryConfig}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: CATEGORIES.map((c) => ({ params: { category: c.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const category = context.params?.category as string;
  const categoryConfig = getCategoryConfig(category);

  if (!categoryConfig) {
    return { notFound: true };
  }

  const { products, total } = await getProducts({ category, perPage: 100 });

  return {
    props: {
      category,
      categoryConfig,
      initialProducts: products,
      initialTotal: total,
    },
  };
};

export default CategoryPage;
