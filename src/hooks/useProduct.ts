import { useEffect, useState } from "react";
import { getProductById } from "../services/api";
import type { Product } from "../types/Product";

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const data = await getProductById(id);
      if (active) {
        setProduct(data);
      }
    }

    if (Number.isFinite(id) && id > 0) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [id]);

  return product;
}
