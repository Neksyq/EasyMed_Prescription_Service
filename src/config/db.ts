import { config } from "dotenv";
import { createPool, Pool } from "mysql2/promise";

config();

const pool: Pool = createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT as string, 10) || 3306,
});

export default pool;
