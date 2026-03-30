import type { Product } from "../types/Product";
import ProductCard from "./ProductCard";

type CardItemProps = {
  product: Product;
};

export default function CardItem({ product }: CardItemProps) {
  return <ProductCard product={product} />;
}
