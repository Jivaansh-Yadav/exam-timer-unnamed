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
        background: `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.38), rgba(255,255,255,0) 45%), linear-gradient(145deg, ${color} 0%, ${color} 58%, rgba(217,83,79,${0.12 + progress / 260}) 100%)`,
      },
    };
  }, [endTime, now, startTime]);
}
