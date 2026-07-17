"use client";

import { useMemo } from "react";
import { padTime } from "@/lib/clock-utils";
import { useLiveTime } from "@/hooks/use-live-time";
import { cn } from "@/utils/utils";

export function TimeLeftCard({
  endTime,
  testStarted = false,
}: {
  endTime: string;
  testStarted?: boolean;
}) {
  const now = useLiveTime();

  const timeLeft = useMemo(() => {
    if (!now) return { hours: "00", minutes: "00", seconds: "00" };

    const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
    const end = new Date(now);
    end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

    const secondsRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 1000));
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;

    return {
      hours: padTime(hours),
      minutes: padTime(minutes),
      seconds: padTime(seconds),
    };
  }, [now, endTime]);

  const isTimeUp = timeLeft.hours === "00" && timeLeft.minutes === "00" && timeLeft.seconds === "00";
  const isWarning = testStarted && parseInt(timeLeft.minutes) <= 5 && !isTimeUp;

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 sm:px-6 sm:py-4 transition-all",
        testStarted
          ? isTimeUp
            ? "border-destructive/40 bg-destructive/10"
            : isWarning
              ? "border-yellow-500/40 bg-yellow-500/10"
              : "border-border bg-card"
          : "border-border bg-card"
      )}
      suppressHydrationWarning
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Time Remaining
      </p>
      <div
        className={cn(
          "flex items-baseline justify-center gap-1 font-heading text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl",
          isTimeUp
            ? "text-destructive"
            : isWarning
              ? "text-yellow-600 dark:text-yellow-500"
              : "text-foreground"
        )}
        suppressHydrationWarning
      >
        <span>{timeLeft.hours}</span>
        <span className="text-muted-foreground opacity-60">:</span>
        <span>{timeLeft.minutes}</span>
        <span className="text-muted-foreground opacity-60">:</span>
        <span>{timeLeft.seconds}</span>
      </div>
    </div>
  );
}
