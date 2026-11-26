import React, { useCallback, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { dummyProducts } from "@/data/dummyProducts";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products/getProducts";
import { getProductReviews } from "@/lib/products/reviews";
import { getCategoryConfig } from "@/lib/categories";
import { Product } from "@/types/product";
import { Review, ReviewSummary } from "@/types/review";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductReviews from "@/components/product-detail/ProductReviews";
import ProductRecommendations from "@/components/product-detail/ProductRecommendations";

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  catalog: Product[];
  reviews: Review[];
  reviewSummary: ReviewSummary;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  catalog,
  reviews,
  reviewSummary,
}) => {
  // header rating follows the reviews section (includes the shopper's own review)
  const [summary, setSummary] = useState<ReviewSummary>(reviewSummary);
  const handleSummary = useCallback((s: ReviewSummary) => setSummary(s), []);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const category = getCategoryConfig(product.category);
  const sub = category?.subcategories.find((s) => s.slug === product.subcategory);

  return (
    <>
      <Head>
        <title>{`${product.name} | STYLEVIN`}</title>
        <meta name="description" content={product.description} />
      </Head>

      <section className="pd-page">
        <nav className="pd-page__crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <FiChevronRight />
          <Link href={`/${product.category}`}>{category?.label ?? product.category}</Link>
          <FiChevronRight />
          <Link href={`/${product.category}/${product.subcategory}`}>
            {sub?.label ?? product.subcategory.replace(/-/g, " ")}
          </Link>
          <FiChevronRight />
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pd-page__inner">
          <ProductGallery
            productId={product.id}
            images={product.images}
            name={product.name}
            discount={discount}
          />
          <ProductInfo
            product={product}
            rating={summary.average}
            reviewCount={summary.total}
          />
        </div>
      </section>

      <ProductReviews
        productId={product.id}
        sizes={product.variants.map((v) => v.size)}
        reviews={reviews}
        summary={reviewSummary}
        onSummaryChange={handleSummary}
      />

      <ProductRecommendations
        product={product}
        catalog={catalog}
        fallback={relatedProducts}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: dummyProducts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { notFound: true };
  }

  const relatedProducts = await getRelatedProducts(product, 5);
  const { reviews, summary } = await getProductReviews(product);
  // used client-side to build "Recommended for You" from browsing history
  const catalog = dummyProducts.filter((p) => p.id !== product.id);

  return {
    props: { product, relatedProducts, catalog, reviews, reviewSummary: summary },
  };
};

export default ProductDetailPage;
