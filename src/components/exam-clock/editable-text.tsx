"use client";

import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/utils";

type EditableTextProps = Omit<ComponentPropsWithoutRef<"input">, "onChange" | "value"> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function EditableText({
  value,
  onValueChange,
  className,
  ...props
}: EditableTextProps) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        "min-w-0 bg-transparent outline-none placeholder:text-[var(--app-text-muted)]",
        "border-b border-transparent focus:border-black/20 hover:border-black/10",
        "transition-colors duration-250",
        className,
      )}
    />
  );
}
