import express from "express";
import authRouter from "./routes/authRouters";
import dotenv from "dotenv";
import { config } from "./config/envConfig";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();
const app = express();
const PORT = config.port || 5000;
app.use(express.json({ limit: "50kb" }));
app.use(helmet()); 
app.use(cors());
app.use("/", authRouter);
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  console.log(req.url);
  next();
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Each IP can make 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(compression());
app.listen(PORT, () => {
    console.log(`Auth Service running with HTTP on port ${PORT}`);
});
