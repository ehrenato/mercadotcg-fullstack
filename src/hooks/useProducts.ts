import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/Product";

export function useProducts(search = "") {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const data = await getProducts(search);
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [search]);

  return { products, loading };
}
