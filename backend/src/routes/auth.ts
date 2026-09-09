import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../db/connection.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'anika_trading_super_secret_jwt_key_2026';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const pool = getPool();
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    const user = rows && rows[0];

    if (!user || user.status !== 'active') {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last_active
    await pool.query('UPDATE users SET last_active = ? WHERE id = ?', ['Just now', user.id]);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
      },
    });
  } catch (err: any) {
    console.error('[Auth Error]', err);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, username, name, email, avatar, role, department, status, last_active FROM users WHERE id = ? LIMIT 1',
      [req.user?.id]
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

export default router;
