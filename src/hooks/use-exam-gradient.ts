"use client";

import { useEffect, useMemo, useState } from "react";
import { getProgressPercent, interpolateHsl } from "@/lib/clock-utils";

export function useExamGradient(startTime: string, endTime: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 3000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => {
    const progress = getProgressPercent(now, startTime, endTime);
    const color = interpolateHsl(progress);
    return {
      progress,
      style: {
        background: `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.32), rgba(255,255,255,0) 42%), linear-gradient(145deg, ${color} 0%, var(--app-surface) 52%, rgba(217,83,79,0.18) 100%)`,
      },
    };
  }, [endTime, now, startTime]);
}
