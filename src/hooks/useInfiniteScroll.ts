import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setPage((current) => current + 1);
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return { page, targetRef };
}
