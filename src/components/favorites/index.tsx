import { useMemo } from "react";
import Link from "next/link";
// import FavBanner from "./Favorite-Banner";
import ProductGrid from "@/components/products/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";
import { dummyProducts } from "@/data/dummyProducts";

const FavPage = () => {
  const { ids, ready } = useWishlist();

  const products = useMemo(
    () =>
      ids
        .map((id) => dummyProducts.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [ids]
  );

  return (
    <>
      {/* <FavBanner /> */}
      {ready && products.length === 0 ? (
        <div className="fav-grid" style={{ display: "block", textAlign: "center" ,  minHeight: "80vh", }}>
          {/* <p>Your wishlist is empty.</p>
          <Link href="/men" className="acc-btn">
            Shop Now
          </Link> */}
        </div>
      ) : (
        <section className="search-results">
          {/* same product card (and Add to Cart button) as the category pages */}
          <ProductGrid products={products} />
        </section>
      )}
    </>
  );
};

export default FavPage;
