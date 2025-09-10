import dotenv from "dotenv";
import path from "path";

// Load `.env` from the root of this service
// dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


export const config = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'host.docker.internal',
    user: process.env.DB_USER || "default_user",
    pass: process.env.DB_PASSWORD || "default_pass",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "default_database",
  },
  jwtSecret: process.env.JWT_SECRET || "default_secret",
};