import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getPool } from '../db/connection.js';

const router = Router();

// GET /api/users - List users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, name, email, role, department, status, last_active, created_at FROM users ORDER BY created_at ASC'
    );
    res.json({ users: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve users', details: err.message });
  }
});

// POST /api/users - Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const pool = getPool();
    const id = `usr-${Date.now()}`;
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, department, status, last_active)
       VALUES (?, ?, ?, ?, ?, ?, 'active', 'Never')`,
      [id, name, email, hash, role || 'editor', department || 'General']
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully in MySQL.',
      user: { id, name, email, role: role || 'editor', department: department || 'General', status: 'active' },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// PATCH /api/users/:id - Update user status or role
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, status, department } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (role) {
      updates.push('role = ?');
      params.push(role);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (department) {
      updates.push('department = ?');
      params.push(department);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields provided' });
      return;
    }

    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ success: true, message: `User ${id} updated.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: `User ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

export default router;
