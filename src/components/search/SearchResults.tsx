import React, { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/WishlistContext";
import { dummyProducts } from "@/data/dummyProducts";
import ProductGrid from "@/components/products/ProductGrid";
import WishlistMatches from "./WishlistMatches";


const SearchResults: React.FC<{ products: Product[]; hasQuery: boolean }> = ({ products, hasQuery }) => {
  const { ids, ready } = useWishlist();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { wishlist, rest } = useMemo(() => {
    if (!compact || !ready || ids.length === 0)
      return { wishlist: [] as Product[], rest: products };

    const wishlist = ids
      .map((id) => dummyProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
    const inWishlist = new Set(wishlist.map((p) => p.id));
    return { wishlist, rest: products.filter((p) => !inWishlist.has(p.id)) };
  }, [ids, ready, products, compact]);

  return (
    <>
      <WishlistMatches products={wishlist} />
      {hasQuery && (rest.length > 0 || wishlist.length === 0) && (
        <ProductGrid products={rest} emptyMessage="No products found." />
      )}
    </>
  );
};

export default SearchResults;
