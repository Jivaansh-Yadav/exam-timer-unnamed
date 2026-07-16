"use client";

import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setHydrated(true);
    }
    // This hook should hydrate once per storage key. Re-running because the
    // caller passed a new fallback value can overwrite active typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local persistence is best-effort and should never disrupt the clock.
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
