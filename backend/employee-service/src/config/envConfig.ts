import dotenv from "dotenv";
import path from "path";

// Determine the correct .env file based on NODE_ENV
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: process.env.PORT || 5001,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "default_user",
    pass: process.env.DB_PASSWORD || "default_pass",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "default_database",
  },
//   jwtSecret: process.env.JWT_SECRET || "default_secret",
};
