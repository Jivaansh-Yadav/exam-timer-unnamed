"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/utils";
import { minutesToTime, padTime, timeToMinutes } from "@/lib/clock-utils";

type TimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function SelectColumn({
  values,
  selected,
  onSelect,
  unit,
  disabled,
}: {
  values: number[];
  selected: number;
  onSelect: (value: number) => void;
  unit: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col items-center">
      <select
        value={selected}
        disabled={disabled}
        onChange={(event) => onSelect(Number(event.target.value))}
        className={cn(
          "h-10 w-16 appearance-none rounded-lg bg-[var(--app-surface)]/80 text-center text-base font-semibold text-[var(--app-text)] outline-none",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] focus:ring-2 focus:ring-[var(--app-primary)]/35",
          "sm:h-11 sm:text-lg",
          disabled && "cursor-not-allowed opacity-50",
        )}
        aria-label={unit}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {padTime(value)}
          </option>
        ))}
      </select>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
        {unit}
      </span>
    </label>
  );
}

export function TimePicker({ label, value, onChange, disabled }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: 60 }, (_, index) => index);
  const total = timeToMinutes(value);
  const selectedHour = Math.floor(total / 60);
  const selectedMinute = total % 60;

  const setHour = (hour: number) => onChange(minutesToTime(hour * 60 + selectedMinute));
  const setMinute = (minute: number) => onChange(minutesToTime(selectedHour * 60 + minute));

  return (
    <motion.div
      whileTap={{ scale: disabled ? 1 : 0.995 }}
      className="relative rounded-xl bg-[var(--app-border)] px-2.5 py-2 sm:px-3"
    >
      <p className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <div className="flex items-center justify-center gap-1">
        <SelectColumn values={hours} selected={selectedHour} onSelect={setHour} unit="Hr" disabled={disabled} />
        <span className="pb-5 text-lg font-semibold text-[var(--app-text-muted)]">:</span>
        <SelectColumn values={minutes} selected={selectedMinute} onSelect={setMinute} unit="Min" disabled={disabled} />
      </div>
    </motion.div>
  );
}
