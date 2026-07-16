"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { reportClockAction } from "@/lib/report-clock-action";

export function FullscreenButton() {
  const { t } = useTranslation();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const Icon = isFullscreen ? Minimize2 : Maximize2;

  async function handleClick() {
    await toggleFullscreen();
    reportClockAction(
      `User toggled the exam clock ${isFullscreen ? "out of" : "into"} fullscreen mode.`,
      "update",
      { field: "fullscreen", value: !isFullscreen },
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="clay-button inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--app-surface)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)]"
      aria-label={t("clock.fullscreen")}
      title={t("clock.fullscreen")}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </motion.button>
  );
}
