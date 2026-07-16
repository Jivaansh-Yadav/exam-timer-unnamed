"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClockDisplay } from "@/components/exam-clock/clock-display";
import { EditableText } from "@/components/exam-clock/editable-text";
import { FullscreenButton } from "@/components/exam-clock/fullscreen-button";
import { LocaleControl } from "@/components/exam-clock/locale-control";
import { MemePopup } from "@/components/exam-clock/meme-popup";
import { TimePicker } from "@/components/exam-clock/time-picker";
import { useDebouncedEffect } from "@/hooks/use-debounced-effect";
import { useExamGradient } from "@/hooks/use-exam-gradient";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { reportClockAction } from "@/lib/report-clock-action";

export function ExamClockScreen() {
  const { t } = useTranslation();
  const [testStarted, setTestStarted] = useState(false);
  const [testName, setTestName] = useLocalStorageState("exam-clock.testName", "");
  const [greeting, setGreeting] = useLocalStorageState("exam-clock.greeting", "");
  const [startTime, setStartTime] = useLocalStorageState("exam-clock.startTime", "09:00");
  const [endTime, setEndTime] = useLocalStorageState("exam-clock.endTime", "17:00");
  const gradient = useExamGradient(startTime, endTime);

  useDebouncedEffect(() => {
    if (testName.trim()) {
      reportClockAction(`User updated the exam clock test name to "${testName.trim()}".`, "update", {
        field: "testName",
      });
    }
  }, [testName]);

  useDebouncedEffect(() => {
    if (greeting.trim()) {
      reportClockAction(`User updated the exam clock greeting to "${greeting.trim()}".`, "update", {
        field: "greeting",
      });
    }
  }, [greeting]);

  useDebouncedEffect(() => {
    reportClockAction(`User set the exam clock start time to ${startTime}.`, "update", {
      field: "startTime",
      value: startTime,
    });
  }, [startTime]);

  useDebouncedEffect(() => {
    reportClockAction(`User set the exam clock end time to ${endTime}.`, "update", {
      field: "endTime",
      value: endTime,
    });
  }, [endTime]);

  async function handleStartTest() {
    setTestStarted(true);
    reportClockAction(`User started the exam clock from ${startTime} to ${endTime}.`, "complete", {
      action_kind: "domain_event",
      action_type: "start_exam_clock",
      startTime,
      endTime,
    });

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser fullscreen can be denied; the clock still switches to display mode.
    }
  }

  return (
    <main
      className="relative flex h-svh w-full flex-col overflow-hidden px-3 text-[var(--app-text)] sm:px-4 md:px-8"
      style={{
        ...gradient.style,
        transition: "background 1400ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/25 to-transparent sm:h-32" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent sm:h-40" />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 flex w-full shrink-0 items-center justify-between gap-3"
        style={{ paddingTop: "max(14px, env(safe-area-inset-top, 0px))" }}
      >
        <EditableText
          value={testName}
          onValueChange={setTestName}
          placeholder={t("clock.testNamePlaceholder")}
          aria-label={t("clock.testNameAria")}
          title={t("clock.testNameAria")}
          className="w-full max-w-xl rounded px-2 py-1 font-heading text-base font-semibold tracking-wide text-[var(--app-text-secondary)] sm:text-lg md:text-xl"
        />
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleControl />
          <FullscreenButton />
        </div>
      </motion.header>

      <ClockDisplay progress={gradient.progress} compact={testStarted} endTime={endTime} testStarted={testStarted} />

      <motion.footer
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 flex w-full shrink-0 flex-col items-center gap-3 sm:gap-5"
        style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 0px))" }}
      >
        <AnimatePresence initial={false}>
          {!testStarted ? (
            <motion.section
              key="setup-controls"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="clay-inset-panel grid w-full max-w-md grid-cols-2 gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/95 p-2.5 sm:gap-3 sm:p-3 md:p-4"
            >
              <TimePicker label={t("clock.start")} value={startTime} onChange={setStartTime} />
              <TimePicker label={t("clock.end")} value={endTime} onChange={setEndTime} />
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartTest}
                className="col-span-2 min-h-11 rounded-xl bg-[var(--app-primary)] px-4 text-base font-semibold tracking-[0.08em] text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/35"
              >
                {t("clock.startTest")}
              </motion.button>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <EditableText
          value={greeting}
          onValueChange={setGreeting}
          placeholder={t("clock.greetingPlaceholder")}
          aria-label={t("clock.greetingAria")}
          title={t("clock.greetingAria")}
          className="w-full max-w-2xl rounded px-2 py-1 text-center text-base font-medium tracking-[0.08em] text-[var(--app-text-secondary)] sm:tracking-[0.12em]"
        />
      </motion.footer>

      <MemePopup />
    </main>
  );
}
