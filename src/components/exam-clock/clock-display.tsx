"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EditableText } from "@/components/exam-clock/editable-text";
import { TimeLeftCard } from "@/components/exam-clock/time-left-card";
import { useLiveTime } from "@/hooks/use-live-time";
import { getResolvedLocale } from "@/i18n";
import { padTime, timeToMinutes } from "@/lib/clock-utils";
import { cn } from "@/utils/utils";

function getSecondsUntilEnd(now: Date, endTime: string) {
  const endMinutes = timeToMinutes(endTime);
  const end = new Date(now);
  end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

  if (end.getTime() < now.getTime() - 1000) {
    end.setDate(end.getDate() + 1);
  }

  return Math.ceil((end.getTime() - now.getTime()) / 1000);
}

export function ClockDisplay({
  progress,
  compact = false,
  endTime,
  testStarted = false,
  testName,
  onTestNameChange,
}: {
  progress: number;
  compact?: boolean;
  endTime: string;
  testStarted?: boolean;
  testName: string;
  onTestNameChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const now = useLiveTime();
  const locale = getResolvedLocale();

  const parts = useMemo(() => {
    const hours24 = now.getHours();
    const hours12 = hours24 % 12 || 12;
    return {
      hours: padTime(hours12),
      minutes: padTime(now.getMinutes()),
      seconds: padTime(now.getSeconds()),
      ampm: hours24 >= 12 ? t("clock.pm") : t("clock.am"),
      date: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(now),
    };
  }, [locale, now, t]);

  const secondsUntilEnd = getSecondsUntilEnd(now, endTime);
  const showFinalCountdown = testStarted && secondsUntilEnd > 0 && secondsUntilEnd <= 5;
  const showTimeUp = testStarted && progress >= 100 && !showFinalCountdown;

  return (
    <section
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col items-center justify-center px-1 text-center md:px-8",
        compact ? "py-3 sm:py-4" : "py-2 sm:py-4",
      )}
    >
      <EditableText
        value={testName}
        onValueChange={onTestNameChange}
        placeholder={t("clock.testNamePlaceholder")}
        aria-label={t("clock.testNameAria")}
        title={t("clock.testNameAria")}
        onFocus={(event) => event.currentTarget.select()}
        className="mb-3 w-full max-w-3xl rounded px-2 py-1 text-center font-heading text-base font-semibold uppercase tracking-[0.32em] text-[var(--app-text-secondary)] placeholder:text-[var(--app-text-secondary)] placeholder:opacity-90 hover:bg-[var(--app-surface)]/35 focus:bg-[var(--app-surface)]/45 focus:ring-2 focus:ring-[var(--app-primary)]/25 sm:mb-4 sm:text-lg sm:tracking-[0.4em] md:text-xl"
      />

      <div className="flex w-full max-w-[1180px] items-end justify-center font-heading leading-none">
        <span className="debossed-digits text-[clamp(3.2rem,17vw,12rem)] font-[300] leading-none tracking-[0.03em]">
          {parts.hours}
        </span>
        <span className="mx-[0.02em] text-[clamp(2.4rem,11vw,8.5rem)] font-[300] leading-none text-[var(--app-text-muted)] opacity-45">
          :
        </span>
        <span className="debossed-digits text-[clamp(3.2rem,17vw,12rem)] font-[300] leading-none tracking-[0.03em]">
          {parts.minutes}
        </span>
        <span className="mx-[0.02em] text-[clamp(2.4rem,11vw,8.5rem)] font-[300] leading-none text-[var(--app-text-muted)] opacity-45">
          :
        </span>
        <span className="flex w-[clamp(5.6rem,18vw,15.5rem)] flex-col items-start justify-end">
          <span className="mb-1 pl-[0.08em] text-[clamp(0.8rem,2.3vw,1.875rem)] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--app-accent)]">
            {parts.ampm}
          </span>
          <span className="text-[clamp(2.3rem,10vw,8.5rem)] font-[300] leading-none tracking-[0.02em] text-[var(--app-text-secondary)] opacity-85">
            {parts.seconds}
          </span>
        </span>
      </div>

      <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--app-text-secondary)] opacity-80 sm:mt-5 sm:text-sm md:mt-7 md:text-base">
        {parts.date}
      </p>

      <div
        className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-black/5 sm:mt-6 sm:w-64 md:mt-7"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[var(--app-primary)] opacity-75"
          style={{ width: `${progress}%`, transition: "width 1000ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>

      {testStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-4 w-full max-w-xs sm:mt-5 md:mt-6"
        >
          <TimeLeftCard endTime={endTime} testStarted={testStarted} />
        </motion.div>
      )}

      <div className="mt-3 flex min-h-[3.25rem] items-center justify-center sm:min-h-[4rem]">
        <AnimatePresence mode="popLayout">
          {showFinalCountdown ? (
            <motion.div
              key={secondsUntilEnd}
              initial={{ opacity: 0, scale: 1.35, y: 6 }}
              animate={{ opacity: 0.9, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.72, y: -10 }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-none tracking-[0.08em] text-[var(--app-primary)]"
              aria-live="assertive"
            >
              {secondsUntilEnd}
            </motion.div>
          ) : null}
          {showTimeUp ? (
            <motion.div
              key="time-up"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-[clamp(1.5rem,4vw,3rem)] font-semibold uppercase tracking-[0.16em] text-[var(--app-primary)]"
              aria-live="assertive"
            >
              {t("clock.timeUp")}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
