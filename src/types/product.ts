export interface ProductVariant {
  size: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;       
  subcategory: string;    
  price: number;
  mrp: number;            
  images: string[];
  variants: ProductVariant[];
  colors: string[];
  brand?: string;         // defaults to the store brand when omitted
  code?: string;
  isNew?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  qikinkStyleCode?: string;
}