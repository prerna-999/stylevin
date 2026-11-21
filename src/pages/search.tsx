import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import ProductBanner from "@/components/products/ProductBanner";
import ProductGrid from "@/components/products/ProductGrid";
import { searchProducts } from "@/lib/products/search";
import { CATEGORIES } from "@/lib/categories";
import { Product } from "@/types/product";

interface SearchPageProps {
  q: string;
  products: Product[];
  total: number;
}

const SearchPage: React.FC<SearchPageProps> = ({ q, products, total }) => (
  <>
    <Head>
      <title>{q ? `Search: ${q} | STYLEVIN` : "Search | STYLEVIN"}</title>
      <meta name="robots" content="noindex" />
    </Head>

    <ProductBanner
      title="Search"
      crumbs={["Home", "Search"]}
      subtitle={
        !q
          ? "Type a product, category or keyword in the search bar."
          : total > 0
          ? `${total} ${total === 1 ? "result" : "results"} for “${q}”`
          : `No results for “${q}”`
      }
    />

    <section className="search-results">
      {q && total === 0 ? (
        <div className="search-results__empty">
          <h2>No products found!</h2>
          <p>Check the spelling, try a more general word, or browse a category.</p>
          <div className="search-results__cats">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="search-results__chip">{c.label}</Link>
            ))}
          </div>
        </div>
      ) : (
        <ProductGrid products={products} emptyMessage="Start typing to search our products." />
      )}
    </section>
  </>
);

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({ query, res }) => {
  const q = (Array.isArray(query.q) ? query.q[0] : query.q ?? "").trim().slice(0, 80);
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  const { products, total } = q ? await searchProducts(q, 100) : { products: [], total: 0 };
  return { props: { q, products, total } };
};

export default SearchPage;
