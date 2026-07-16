import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getProgressPercent } from "@/lib/clock-utils";

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format");

export function registerDescribeExamClock(server: McpServer, userId: string) {
  server.registerTool(
    "describe_exam_clock",
    {
      description: "Describe the live exam clock display and its local-first behavior.",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              userId,
              app: "Live Exam Clock",
              visibleSurface: [
                "inline editable test name",
                "massive live time with seconds and AM/PM",
                "full date",
                "start and end wheel pickers",
                "inline editable greeting",
                "corner fullscreen and language controls",
              ],
              persistence: "Browser localStorage stores test name, greeting, start time, and end time.",
              hiddenBehavior: "Scheduled meme popups are configured in src/lib/meme-triggers.ts and are not exposed as UI settings.",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );
}

export function registerCalculateExamProgress(server: McpServer) {
  server.registerTool(
    "calculate_exam_progress",
    {
      description: "Calculate progress percentage for a current time between exam start and end times.",
      inputSchema: {
        currentTime: timeSchema.describe("Current local time in HH:MM format."),
        startTime: timeSchema.describe("Exam start time in HH:MM format."),
        endTime: timeSchema.describe("Exam end time in HH:MM format."),
      },
    },
    async ({ currentTime, startTime, endTime }) => {
      const [hours, minutes] = currentTime.split(":").map(Number);
      const current = new Date();
      current.setHours(hours ?? 0, minutes ?? 0, 0, 0);
      const progress = getProgressPercent(current, startTime, endTime);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ currentTime, startTime, endTime, progress }, null, 2),
          },
        ],
      };
    },
  );
}

export function registerDraftExamDisplay(server: McpServer) {
  server.registerTool(
    "draft_exam_display",
    {
      description: "Draft local clock display values that a user can copy into the app.",
      inputSchema: {
        testName: z.string().min(1).max(80).describe("Exam or test title."),
        greeting: z.string().min(1).max(140).describe("Short greeting shown at the bottom."),
        startTime: timeSchema.describe("Exam start time in HH:MM format."),
        endTime: timeSchema.describe("Exam end time in HH:MM format."),
      },
    },
    async (input) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...input,
              note: "These values are applied in the browser UI and persist locally after editing.",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );
}
