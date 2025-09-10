import dotenv from "dotenv";
import path from "path";

// Load `.env` from the root of this service
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: process.env.PORT || 5002,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "default_user",
    pass: process.env.DB_PASSWORD || "default_pass",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "default_database",
  },
};