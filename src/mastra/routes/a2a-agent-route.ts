import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");

      const body = await c.req.json();
      const { jsonrpc, id: requestId, params } = body;

      if (jsonrpc !== "2.0" || !requestId) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId || null,
            error: {
              code: -32600,
              message:
                'Invalid Request: jsonrpc must be "2.0" and id is required',
            },
          },
          400
        );
      }

      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: `Agent '${agentId}' not found`,
            },
          },
          404
        );
      }

      const { message, messages, contextId, taskId } = params || {};
      let messagesList = [];
      if (message) {
        messagesList = [message];
      } else if (Array.isArray(messages)) {
        messagesList = messages;
      }

      if (messagesList.length === 0) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: {
              code: -32602,
              message: "No messages provided in params",
            },
          },
          400
        );
      }

      const mastraMessages = messagesList.map((msg) => ({
        role: msg.role || "user",
        content: Array.isArray(msg.parts)
          ? msg.parts
              .map((part: { kind: string; text?: string; data?: unknown }) => {
                if (part.kind === "text") return part.text;
                if (part.kind === "data") return JSON.stringify(part.data);
                return "";
              })
              .join("\n")
          : "",
      }));

      // const stream = (await agent.stream(
      //   mastraMessages
      // )) as unknown as AsyncIterable<{ text?: string }>;

      // let agentText = "";
      // for await (const chunk of stream) {
      //   if (chunk?.text) agentText += chunk.text;
      // }
      const response = await agent.generate(mastraMessages);
      const agentText = response.text || '';

      const artifacts: any = [
        {
          artifactId: randomUUID(),
          name: `${agentId}Response`,
          parts: [{ kind: "text", text: agentText }],
        },
      ];

      if (response.toolResults && response.toolResults.length > 0) {
        artifacts.push({
          artifactId: randomUUID(),
          name: "ToolResults",
          parts: response.toolResults.map((result) => ({
            kind: "data",
            data: result,
          })),
        });
      }

      const history = [
        ...messagesList.map((msg) => ({
          kind: "message",
          role: msg.role || "user",
          parts: msg.parts || [],
          content: Array.isArray(msg.parts)
            ? msg.parts.map((p: { text?: string }) => p.text || "").join("\n")
            : "",
          messageId: msg.messageId || randomUUID(),
          taskId: msg.taskId || taskId || randomUUID(),
        })),
        {
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: agentText }],
          content: agentText,
          messageId: randomUUID(),
          taskId: taskId || randomUUID(),
        },
      ];
      
      // Return A2A compliant response
      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: taskId || randomUUID(),
          contextId: contextId || randomUUID(),
          status: {
            state: "completed",
            timestamp: new Date().toISOString(),
            message: {
              messageId: randomUUID(),
              role: "agent",
              parts: [{ kind: "text", text: agentText }],
              content: agentText,
              kind: "message",
            },
          },
          artifacts,
          history,
          kind: "task",
        },
      });
    } catch (error: any ) {
      console.error("A2A route error:", error);
      return c.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: "Internal error",
            data: {
              details: error instanceof Error ? error.message : String(error),
            },
          },
        },
        500
      );
    }
  },
});
