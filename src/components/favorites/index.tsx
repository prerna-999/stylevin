import FavBanner from "./Favorite-Banner";
import FavoritesCard, { FavoriteItem } from "./Favorite-Cards";

const sampleItem: FavoriteItem = {
  id: 1,
  sku: "MZ28",
  name: "Super Combed Cotton Rich Graphic Printed T-Shirt - Egret",
  price: "₹999",
  image:
    "https://cdn.shopify.com/s/files/1/0753/1056/3627/files/MZ28_IPEGRET_0101_S126_Jky_01.jpg?width=500&height=650",
  tag: "New",
};

const FavPage = () => {
  const handleRemove = (id: number) => {
    console.log("remove", id);
  };

  const handleAddToCart = (item: FavoriteItem) => {
    console.log("add to cart", item);
  };

  return (
    <>
      <FavBanner />
      <div className="fav-grid">
        <FavoritesCard
          item={sampleItem}
          onRemove={handleRemove}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
};

export default FavPage;