"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTriggerTime } from "@/lib/clock-utils";
import { memeTriggers, type MemeTrigger } from "@/lib/meme-triggers";
import { useLiveTime } from "@/hooks/use-live-time";

type QueuedMeme = MemeTrigger & { key: string };

function canLoadImage(imageUrl: string) {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (!imageUrl.startsWith("data:image/")) {
      try {
        const url = new URL(imageUrl);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
          resolve(false);
          return;
        }
      } catch {
        resolve(false);
        return;
      }
    }

    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

export function MemePopup() {
  const now = useLiveTime();
  const [queue, setQueue] = useState<QueuedMeme[]>([]);
  const [active, setActive] = useState<QueuedMeme | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const skippedRef = useRef<Set<string>>(new Set());

  const entrance = useMemo(() => {
    const options = [
      { x: 0, y: -42 },
      { x: 42, y: 0 },
      { x: 0, y: 42 },
      { x: -42, y: 0 },
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0];
  }, [active?.key]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    return;
    // const timeout = window.setTimeout(() => {
    //   setQueue((previous) => [
    //     ...previous,
    //     { ...previewMemeTrigger, key: `preview-${Date.now()}` },
    //   ]);
    // }, 3500);
    // return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!now) return;
    const current = formatTriggerTime(now);
    const currentWithSeconds = `${current}:${String(now.getSeconds()).padStart(2, "0")}`;
    const dayKey = now.toDateString();
    
    // Match both "HH:MM" and "HH:MM:SS" formats
    const due = memeTriggers.filter(
      (trigger) => trigger.time === current || trigger.time === currentWithSeconds
    );
    
    if (!due.length) return;

    setQueue((previous) => {
      const next = [...previous];
      for (const trigger of due) {
        const key = `${dayKey}-${trigger.time}-${trigger.imageUrl}`;
        
        // Skip if we already fired this trigger
        if (firedRef.current.has(key)) {
          continue;
        }
        
        // Skip if we already tried and failed to load this
        if (skippedRef.current.has(key)) {
          continue;
        }
        
        next.push({ ...trigger, key });
      }
      return next;
    });
  }, [now]);

  // Separate effect: process queue items one at a time
  useEffect(() => {
    if (queue.length === 0) return;
    if (active) return; // Don't process while one is showing

    const candidate = queue[0];
    let cancelled = false;
    canLoadImage(candidate.imageUrl).then((canLoad) => {
      if (cancelled) return;
      if (canLoad) {
        // Mark as fired BEFORE displaying (so if the trigger fires again next second, it's skipped)
        firedRef.current.add(candidate.key);
        setActive(candidate);
        // Remove from queue after setting active
        setQueue((q) => q.slice(1));
      } else {
        skippedRef.current.add(candidate.key);
        // Also mark as fired so we don't retry next second
        firedRef.current.add(candidate.key);
        // Remove from queue even if it failed
        setQueue((q) => q.slice(1));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [queue, active]);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => setActive(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [active]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.aside
          key={active.key}
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center px-4"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82, x: entrance.x, y: entrance.y }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.86, y: -18 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-[min(82vw,380px)] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-center shadow-lg"
          >
            <p className="mb-3 text-base font-semibold text-[var(--app-text)]">{active.caption}</p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--app-border)]">
              <img
                src={active.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
                onError={() => {
                  skippedRef.current.add(active.key);
                  setActive(null);
                }}
              />
            </div>
          </motion.div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
