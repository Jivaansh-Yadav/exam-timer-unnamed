import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerCalculateExamProgress,
  registerDescribeExamClock,
  registerDraftExamDisplay,
} from "./tools/exam-clock";

export function buildMcpServer(userId: string): McpServer {
  const server = new McpServer({
    name: "live-exam-clock",
    version: "1.0.0",
  });

  registerDescribeExamClock(server, userId);
  registerCalculateExamProgress(server);
  registerDraftExamDisplay(server);

  return server;
}
