import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'anika_trading_db';

let pool: mysql.Pool | null = null;

export async function initializeDatabase(): Promise<mysql.Pool> {
  if (pool) return pool;

  console.log(`[MySQL] Connecting to ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);

  // Step 1: Ensure database exists
  try {
    const rootConn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConn.end();
    console.log(`[MySQL] Database \`${DB_NAME}\` verified or created.`);
  } catch (err: any) {
    console.warn(`[MySQL] Warning during database creation check: ${err.message}`);
    // If password mismatch, log clear instruction
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(
        `[MySQL ERROR] Access denied for user '${DB_USER}'@'${DB_HOST}'. Please check DB_PASSWORD in backend/.env!`
      );
    }
  }

  // Step 2: Create connection pool to the application database
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    maxIdle: 10,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Return DATE/DATETIME/TIMESTAMP columns as plain strings instead of JS
    // Date objects — otherwise JSON-serializing a Date silently shifts it to
    // UTC, which can display as the wrong calendar day.
    dateStrings: true,
  });

  return pool;
}

export function getPool(): mysql.Pool {
  if (!pool) {
    throw new Error('[MySQL] Pool has not been initialized. Call initializeDatabase() first.');
  }
  return pool;
}
