export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  idioma: string;
  qualidade: string;
  extras: string;
  image_url: string | null;
  user_id: number;
  seller_name?: string;
  created_at?: string;
}