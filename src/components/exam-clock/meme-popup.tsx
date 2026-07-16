"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTriggerTime } from "@/lib/clock-utils";
import { memeTriggers, type MemeTrigger } from "@/lib/meme-triggers";
import { useLiveTime } from "@/hooks/use-live-time";

type QueuedMeme = MemeTrigger & { key: string };

export function MemePopup() {
  const now = useLiveTime();
  const [queue, setQueue] = useState<QueuedMeme[]>([]);
  const [active, setActive] = useState<QueuedMeme | null>(null);
  const [failedKeys, setFailedKeys] = useState<Set<string>>(() => new Set());
  const firedRef = useRef<Set<string>>(new Set());

  const side = useMemo(() => {
    const sides = [
      { x: 0, y: -34 },
      { x: 34, y: 0 },
      { x: 0, y: 34 },
      { x: -34, y: 0 },
    ];
    return sides[Math.floor(Math.random() * sides.length)] ?? sides[0];
  }, [active?.key]);

  useEffect(() => {
    const current = formatTriggerTime(now);
    const dayKey = now.toDateString();
    const due = memeTriggers.filter((trigger) => trigger.time === current);
    if (!due.length) return;

    setQueue((previous) => {
      const next = [...previous];
      for (const trigger of due) {
        const key = `${dayKey}-${trigger.time}-${trigger.imageUrl}`;
        if (firedRef.current.has(key)) continue;
        firedRef.current.add(key);
        next.push({ ...trigger, key });
      }
      return next;
    });
  }, [now]);

  useEffect(() => {
    if (active || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setActive(next ?? null);
  }, [active, queue]);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => setActive(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [active]);

  useEffect(() => {
    if (!active || !failedKeys.has(active.key)) return;
    setActive(null);
  }, [active, failedKeys]);

  return (
    <AnimatePresence>
      {active && !failedKeys.has(active.key) ? (
        <motion.aside
          key={active.key}
          initial={{ opacity: 0, scale: 0.86, x: side.x, y: side.y }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: -18 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed left-1/2 top-1/2 z-40 w-[min(82vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-center shadow-lg"
          aria-live="polite"
        >
          <p className="mb-3 text-base font-semibold text-[var(--app-text)]">{active.caption}</p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--app-border)]">
            <Image
              src={active.imageUrl}
              alt=""
              fill
              sizes="360px"
              className="object-cover"
              onError={() => {
                setFailedKeys((previous) => new Set(previous).add(active.key));
              }}
            />
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
