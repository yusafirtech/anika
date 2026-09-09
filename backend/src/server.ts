import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase, getPool } from './db/connection.js';
import { runMigrations } from './db/schema.js';
import { seedInitialData } from './db/seed.js';

// Route imports
import authRouter from './routes/auth.js';
import pagesRouter from './routes/pages.js';
import mediaRouter from './routes/media.js';
import leadsRouter from './routes/leads.js';
import usersRouter from './routes/users.js';
import collectionsRouter from './routes/collections.js';
import clientsRouter from './routes/clients.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Middleware
app.use(morgan('dev'));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, mobile apps)
      // plus any origin explicitly whitelisted via CORS_ORIGIN in .env,
      // and any localhost/127.0.0.1 origin for local development.
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' is not allowed by CORS policy`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/pages', pagesRouter);
app.use('/api', mediaRouter); // Mounts /api/upload and /api/media/*
app.use('/api/leads', leadsRouter);
app.use('/api/users', usersRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/clients', clientsRouter);

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    status: 'ok',
    service: 'ANIKA TRADING & CO. Backend API',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root Welcome Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'ANIKA TRADING & CO. Production Backend Server (MySQL)',
    docs: '/api/health',
    endpoints: [
      '/api/auth/login',
      '/api/pages/:pageKey',
      '/api/upload',
      '/api/media/:filename',
      '/api/leads',
      '/api/users',
      '/api/collections/:key',
      '/api/clients',
    ],
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Unhandled Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Bootstrapping function
async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('Starting ANIKA TRADING & CO. Backend Server...');
    console.log('----------------------------------------------------');

    // 1. Connect to MySQL
    await initializeDatabase();

    // 2. Run Migrations
    await runMigrations();

    // 3. Seed Initial Content
    await seedInitialData();

    // 4. Start HTTP Server
    app.listen(PORT, () => {
      console.log(`[Server] ANIKA backend running live at http://localhost:${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[Server] Database storage: MySQL 8.0 (LONGBLOB media support)`);
      console.log('----------------------------------------------------');
    });
  } catch (err: any) {
    console.error('[Fatal Bootstrap Error]', err);
    console.error('Server cannot start without database connection.');
  }
}

startServer();
