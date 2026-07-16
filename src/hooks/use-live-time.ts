"use client";

import { useEffect, useMemo, useState } from "react";

export function useLiveTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => now || new Date(), [now]);
}
