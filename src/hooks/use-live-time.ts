"use client";

import { useEffect, useMemo, useState } from "react";

export function useLiveTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => now, [now]);
}
