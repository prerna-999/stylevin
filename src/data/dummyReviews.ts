/**
 * PLACEHOLDER REVIEWS — development data only, same as dummyProducts.
 * Replace with real customer reviews from your backend / review app
 * before going live. Only `getProductReviews()` in lib/products/reviews.ts
 * reads this file, so that is the single place to swap in the real source.
 */

export interface ReviewTemplate {
  rating: number;
  title: string;
  comment: string;
}

export const REVIEW_AUTHORS = [
  "Aarav S.",
  "Priya M.",
  "Rohan K.",
  "Simran K.",
  "Karan V.",
  "Ananya R.",
  "Ishaan P.",
  "Neha G.",
  "Arjun T.",
  "Meera J.",
  "Vikram D.",
  "Pooja B.",
];

export const REVIEW_TEMPLATES: ReviewTemplate[] = [
  { rating: 5, title: "Perfect fit", comment: "Fits exactly as shown in the size chart. Fabric feels premium and soft, and the colour is the same as the pictures." },
  { rating: 5, title: "Great quality for the price", comment: "Stitching is neat and the material has a nice weight to it. Washed it twice already and it still looks new." },
  { rating: 5, title: "Loved it", comment: "Very comfortable for all-day wear. Got a lot of compliments the first time I wore it." },
  { rating: 4, title: "Good, runs slightly big", comment: "Quality is really good. It runs a little loose, so go one size down if you don't want a relaxed fit." },
  { rating: 4, title: "Nice product", comment: "Looks good and feels comfortable. Delivery took a couple of days longer than expected, but the product is worth it." },
  { rating: 4, title: "Worth buying", comment: "Good fabric and finish. The colour is slightly lighter than in the photos but I still like it." },
  { rating: 3, title: "Decent", comment: "Average quality for the price. Fit is fine but I expected the fabric to be a bit thicker." },
  { rating: 3, title: "Okay okay", comment: "Product is fine for casual use. Size was a little different from what I usually wear." },
  { rating: 2, title: "Not as expected", comment: "The fit was not right for me and the fabric felt thinner than I expected. Returned it." },
  { rating: 1, title: "Disappointed", comment: "Size did not match the chart for me. The exchange process was easy though." },
];
