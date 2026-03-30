export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  seller?: string;
  condition?: string;
  images?: string[];
}
