import WebSocket from "ws";

let ws: WebSocket | null = null;
let queue: string[] = [];

const WS_URL = process.env.EMAIL_SERVICE_WS || "ws://email-service:6000";

function connect() {
  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("[auth-service] Connected to email-service WS");
    // flush any queued messages
    queue.forEach(msg => ws?.send(msg));
    queue = [];
  });

  ws.on("close", () => {
    console.warn("[auth-service] WS closed. Reconnecting in 3s...");
    ws = null;
    setTimeout(connect, 3000);
  });

  ws.on("error", (err) => {
    console.error("[auth-service] WS error:", err.message);
  });
}

connect();

export function sendWs(jsonPayload: unknown) {
  const str = JSON.stringify(jsonPayload);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(str);
  } else {
    // buffer until connected
    queue.push(str);
  }
}
