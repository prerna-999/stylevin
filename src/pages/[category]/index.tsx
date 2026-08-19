import React, { useState, useMemo } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ProductBanner from "@/components/products/ProductBanner";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import ProductPagination from "@/components/products/ProductPagination";
import { CATEGORIES, getCategoryConfig, CategoryConfig } from "@/lib/categories";
import { getProducts } from "@/lib/products/getProducts";
import { Product } from "@/types/product";

interface CategoryPageProps {
  category: string;
  categoryConfig: CategoryConfig;
  initialProducts: Product[];
  initialTotal: number;
}

const PER_PAGE = 8;

const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  categoryConfig,
  initialProducts,
}) => {
  const [subcategory, setSubcategory] = useState<string | undefined>(
    undefined
  );
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let results = [...initialProducts];
    if (subcategory) {
      results = results.filter((p) => p.subcategory === subcategory);
    }
    switch (sort) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return results;
  }, [initialProducts, subcategory, sort]);

  const totalPages = Math.max(Math.ceil(filtered.length / PER_PAGE), 1);
  const paginated = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <>
      <ProductBanner
        title={categoryConfig.label}
        crumbs={["Home", categoryConfig.label]}
      />

      <section className="product-listing">
        <div className="product-listing__inner">
          <ProductFilters
            categoryConfig={categoryConfig}
            activeSubcategory={subcategory}
            onSubcategoryChange={(sub) => {
              setSubcategory(sub);
              setPage(1);
            }}
            sort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            resultCount={filtered.length}
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