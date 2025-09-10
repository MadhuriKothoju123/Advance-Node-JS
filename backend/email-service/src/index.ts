
import dotenv from "dotenv";
import { startWsServer } from "./websocket/wsClient";
dotenv.config();
const PORT = Number(process.env.PORT || 6000);

startWsServer(PORT);