import React from "react";

type Category = {
  id: string;
  name: string;
  image?: string;
};

const CATEGORIES: Category[] = [
  {
    id: "men",
    name: "Men Clothing",
    image:
      "https://wtflex.in/cdn/shop/files/Mocha_Cord_Shirt_Mockup_File.jpg?v=1776940708&width=600",
  },
  {
    id: "women",
    name: "Women Clothing",
    image:
      "https://wtflex.in/cdn/shop/files/Flow_State_Mockup_File_277ce942-d93d-4550-900f-60959907867a.jpg?v=1776941974&width=600",
  },
  {
    id: "kids",
    name: "Kid Clothing",
    image:
      "https://wtflex.in/cdn/shop/files/Cold_Breed_Mockup_File.jpg?v=1776942186&width=600",
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://wtflex.in/cdn/shop/files/Super_Saucy_Mockup_File.jpg?v=1776941551&width=600",
  },
  {
    id: "oversized",
    name: "Over Sized T-Shirt",
    image:
      "https://wtflex.in/cdn/shop/files/Organic_Mockup_File.jpg?v=1776941278&width=600",
  },
  {
    id: "zodiac",
    name: "Zodiac Sign T-Shirt",
    image:
      "https://wtflex.in/cdn/shop/files/Inner_Peace_Mockup_File.jpg?v=1776942254&width=600",
  },
];

const MARQUEE_TEXT = "Stylevin — Always In It";
const MARQUEE_ITEM_COUNT = 6;

export default function Categories() {
  return (
    <section className="category-section" aria-label="Shop by category">
      <div className="category-marquee" aria-hidden="true">
        <div className="category-marquee__track">
          <div className="category-marquee__group">
            {Array.from({ length: MARQUEE_ITEM_COUNT }).map((_, i) => (
              <span className="category-marquee__item" key={`a-${i}`}>
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
          <div className="category-marquee__group" aria-hidden="true">
            {Array.from({ length: MARQUEE_ITEM_COUNT }).map((_, i) => (
              <span className="category-marquee__item" key={`b-${i}`}>
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="category-grid-wrap">
         <div className="trending-now__badge" aria-hidden="true">
        <span className="trending-now__badge-pin" />
        <span className="trending-now__badge-eyebrow">Shop By </span>
        <span className="trending-now__badge-title">Category</span>
        <span className="trending-now__badge-underline" />
      </div>

        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <a
              href="#"
              className="category-tile"
              key={category.id}
              aria-label={category.name}
            >
              <div className="category-tile__img-wrap">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="category-tile__img"
                  />
                ) : (
                  <div className="category-tile__placeholder">
                    <span className="category-tile__placeholder-name">
                      {category.name}
                    </span>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}