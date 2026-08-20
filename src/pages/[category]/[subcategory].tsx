import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import ProductBanner from "@/components/products/ProductBanner";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import ProductPagination from "@/components/products/ProductPagination";
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

const PER_PAGE = 8;

const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  categoryConfig,
  subcategory,
  subcategoryLabel,
  initialProducts,
}) => {
  const router = useRouter();
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const sorted = [...initialProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
  });

  const totalPages = Math.max(Math.ceil(sorted.length / PER_PAGE), 1);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <ProductBanner
        title={subcategoryLabel}
        crumbs={["Home", categoryConfig.label, subcategoryLabel]}
      />

      <section className="product-listing">
        <div className="product-listing__inner">
          <ProductFilters
            categoryConfig={categoryConfig}
            activeSubcategory={subcategory}
            onSubcategoryChange={(sub) => {
              if (!sub) {
                router.push(`/${category}`);
              } else {
                router.push(`/${category}/${sub}`);
              }
            }}
            sort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            resultCount={sorted.length}
          />

          <ProductGrid products={paginated} />

          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
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