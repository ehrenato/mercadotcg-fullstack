import { useEffect, useState } from "react";
import { getProductById, type Product } from "../services/api";

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getProductById(id);

        if (active) {
          setProduct(data);
        }
      } catch {
        if (active) {
          setProduct(null);
        }
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