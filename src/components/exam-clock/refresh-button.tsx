"use client";

import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { reportClockAction } from "@/lib/report-clock-action";

export function RefreshButton() {
  const { t } = useTranslation();

  function handleClick() {
    reportClockAction("User refreshed the exam clock to set a new time.", "update", {
      action_kind: "navigation",
      action_type: "refresh_exam_clock",
    });
    window.location.reload();
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="clay-button inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--app-surface)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]"
      aria-label={t("clock.refresh")}
      title={t("clock.refresh")}
    >
      <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
    </motion.button>
  );
}
