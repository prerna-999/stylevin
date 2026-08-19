import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { dummyProducts } from "@/data/dummyProducts";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products/getProducts";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <>
      <section className="product-detail">
        <div className="product-detail__inner">
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="product-detail__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`product-detail__thumb ${
                      i === activeImage ? "is-active" : ""
                    }`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img} alt="" fill sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__name">{product.name}</h1>

            {product.rating && (
              <div className="product-detail__rating">
                ★ {product.rating}{" "}
                <span>({product.reviewCount} reviews)</span>
              </div>
            )}

            <div className="product-detail__price-row">
              <span className="product-detail__price">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="product-detail__mrp">₹{product.mrp}</span>
                  <span className="product-detail__discount">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="product-detail__description">
              {product.description}
            </p>

            <div className="product-detail__sizes">
              <p className="product-detail__label">Select Size</p>
              <div className="product-detail__size-list">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    disabled={v.stock === 0}
                    className={`product-detail__size-btn ${
                      selectedSize === v.size ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedSize(v.size)}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="product-detail__add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="product-detail__related">
          <div className="product-detail__related-inner">
            <h2>You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
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

  const relatedProducts = await getRelatedProducts(product);

  return {
    props: { product, relatedProducts },
  };
};

export default ProductDetailPage;