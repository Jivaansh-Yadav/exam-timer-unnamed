"use client";

import { useEffect, useRef } from "react";

export function useDebouncedEffect(effect: () => void, dependencies: unknown[], delay = 900) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const timeout = window.setTimeout(effect, delay);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
