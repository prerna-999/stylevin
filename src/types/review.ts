export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: number; // 1 – 5
  title: string;
  comment: string;
  date: string; // ISO date
  size?: string;
  verified?: boolean;
  helpful?: number;
  isOwn?: boolean; // written by the current shopper (stored in localStorage)
}

export interface ReviewSummary {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}
