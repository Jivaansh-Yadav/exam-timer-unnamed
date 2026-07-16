"use client";

import { memory } from "@eazo/sdk";

export function reportClockAction(
  content: string,
  eventType: "update" | "open" | "complete" = "update",
  metadata: Record<string, unknown> = {},
) {
  memory
    .reportAction({
      content,
      event_type: eventType,
      page: "exam-clock",
      metadata: {
        type: "exam_clock_preference",
        ...metadata,
      },
    })
    .catch(() => {});
}
