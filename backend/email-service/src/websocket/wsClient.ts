import { WebSocketServer } from "ws";
import { sendPasswordResetEmail } from "../workers/emailWorker";

type InboundEvent =
  | { type: "PASSWORD_RESET"; payload: { email: string; fullName?: string | null; resetLink: string } };

export function startWsServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    console.log("[email-service] New WS client connected");

    ws.on("message", async (raw) => {
      try {
        const event = JSON.parse(raw.toString()) as InboundEvent;

        if (event.type === "PASSWORD_RESET") {
          await sendPasswordResetEmail(event.payload);
        }
      } catch (err: any) {
        console.error("[email-service] Failed to process WS message:", err?.message);
      }
    });
  });

  console.log(`[email-service] WS listening on ws://0.0.0.0:${port}`);
}
