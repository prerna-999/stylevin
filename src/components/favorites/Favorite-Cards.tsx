"use client";

export interface FavoriteItem {
  id: number;
  sku: string;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  tag?: string;
}

interface FavoritesCardProps {
  item: FavoriteItem;
  onRemove: (id: number) => void;
  onAddToCart: (item: FavoriteItem) => void;
}

export default function FavoritesCard({
  item,
  onRemove,
  onAddToCart,
}: FavoritesCardProps) {
  if (!item) return null;

  return (
    <div className="fav-card">
      <div className="fav-card-media">
        {item.tag && <span className="fav-tag">{item.tag}</span>}

        <button
          type="button"
          className="fav-remove"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from favorites`}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21s-7.5-4.6-10-9.3C.6 8.1 2.3 4.5 6 4.1c2.2-.3 4 .9 6 3 2-2.1 3.8-3.3 6-3 3.7.4 5.4 4 4 7.6C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} loading="lazy" />

        <button
          type="button"
          className="fav-quickadd"
          onClick={() => onAddToCart(item)}
        >
          Add to Cart
        </button>
      </div>

      <div className="fav-card-body">
        <div className="fav-card-sku">#{item.sku}</div>
        <p className="fav-card-name">{item.name}</p>
        <div className="fav-card-price-row">
          <span className="fav-card-price">{item.price}</span>
          {item.oldPrice && (
            <span className="fav-card-price-old">{item.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}