"use client";

import { Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  changeLocale,
  getLocalePreference,
  type LocalePreference,
} from "@/i18n";
import { reportClockAction } from "@/lib/report-clock-action";

const cycle: LocalePreference[] = ["system", "en-US", "zh-CN"];

export function LocaleControl() {
  const { t } = useTranslation();
  const [preference, setPreference] = useState<LocalePreference>("system");

  useEffect(() => {
    setPreference(getLocalePreference());
  }, []);

  const label =
    preference === "zh-CN"
      ? t("language.zhCN")
      : preference === "en-US"
        ? t("language.enUS")
        : t("language.followSystem");

  async function handleClick() {
    const index = cycle.indexOf(preference);
    const next = cycle[(index + 1) % cycle.length] ?? "system";
    setPreference(next);
    await changeLocale(next);
    reportClockAction(`User changed the exam clock language preference to ${next}.`, "update", {
      field: "language",
      value: next,
    });
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="clay-button inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full bg-[var(--app-surface)] px-3 text-xs font-semibold text-[var(--app-text-secondary)] hover:text-[var(--app-text)]"
      aria-label={t("language.triggerLabel", { language: label })}
      title={t("language.triggerLabel", { language: label })}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{preference === "zh-CN" ? "中" : preference === "en-US" ? "EN" : "A"}</span>
    </motion.button>
  );
}
