import React, { useMemo } from "react";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";
import { recommendProducts } from "@/lib/products/recommend";

interface ProductRecommendationsProps {
  product: Product;
  /** every other product the shopper could be shown */
  catalog: Product[];
  /** server-rendered fallback (same category) used before history loads */
  fallback: Product[];
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  product,
  catalog,
  fallback,
  limit = 5,
}) => {
  const history = useBrowsingHistory(product.id);
  const hasHistory = history.length > 0;

  const recommended = useMemo(
    () => (hasHistory ? recommendProducts(product, catalog, history, limit) : fallback.slice(0, limit)),
    [hasHistory, product, catalog, history, limit, fallback]
  );

  const recentlyViewed = useMemo(() => {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return history
      .map((id) => byId.get(id))
      .filter((p): p is Product => !!p)
      .slice(0, limit);
  }, [history, catalog, limit]);

  return (
    <>
      {recommended.length > 0 && (
        <section className="pd-recs">
          <div className="pd-recs__inner">
            <div className="pd-recs__head">
              <h2>{hasHistory ? "Recommended for You" : "You May Also Like"}</h2>
              {hasHistory && <p>Based on what you&apos;ve been browsing</p>}
            </div>
            <ProductGrid products={recommended} />
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="pd-recs pd-recs--recent">
          <div className="pd-recs__inner">
            <div className="pd-recs__head">
              <h2>Recently Viewed</h2>
            </div>
            <ProductGrid products={recentlyViewed} />
          </div>
        </section>
      )}
    </>
  );
};

export default ProductRecommendations;
