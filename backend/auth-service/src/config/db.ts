import { Pool } from "pg";
import { config } from "./envConfig";

const {host, user, pass, port, database} = config.db;
export const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: pass,
  port: Number(port),
});
