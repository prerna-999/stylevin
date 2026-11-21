import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FavBanner from "./Favorite-Banner";
import FavoritesCard, { FavoriteItem } from "./Favorite-Cards";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { dummyProducts } from "@/data/dummyProducts";
import { inStockSizes } from "@/lib/products/listing";

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const FavPage = () => {
  const router = useRouter();
  const { ids, toggle, ready } = useWishlist();
  const { addItem } = useCart();

  const products = useMemo(
    () =>
      ids
        .map((id) => dummyProducts.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [ids]
  );

  const items: FavoriteItem[] = products.map((p) => ({
    id: p.id,
    sku: (p.code ?? String(p.id)).replace(/^#/, ""),
    name: p.name,
    price: rupee(p.price),
    oldPrice: p.mrp > p.price ? rupee(p.mrp) : undefined,
    image: p.images[0],
    tag: p.isNew ? "New" : undefined,
  }));

  const handleRemove = (id: number) => toggle(id);

  const handleAddToCart = (item: FavoriteItem) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;
    const sizes = inStockSizes(product);
    if (sizes.length === 1) {
      addItem(product, { size: sizes[0], color: product.colors[0] });
    } else {
      // multiple sizes: send the shopper to the product page to choose one
      router.push(`/product/${product.slug}`);
    }
  };

  return (
    <>
      <FavBanner />
      {ready && items.length === 0 ? (
        <div className="fav-grid" style={{ display: "block", textAlign: "center" }}>
          <p>Your wishlist is empty.</p>
          <Link href="/men" className="acc-btn">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="fav-grid">
          {items.map((item) => (
            <FavoritesCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FavPage;
