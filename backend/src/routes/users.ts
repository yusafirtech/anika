import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// All user-management routes require a signed-in session; only admins and
// managers may view the list, and only admins may create/modify/delete
// other accounts. Any signed-in user may manage their own account via /me.
router.use(authenticateToken);

function duplicateFieldFromError(err: any): 'username' | 'email' {
  return /username/i.test(err?.sqlMessage || '') ? 'username' : 'email';
}

// GET /api/users - List users
router.get('/', requireRole(['admin', 'manager']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, username, name, email, avatar, role, department, status, last_active, created_at FROM users ORDER BY created_at ASC'
    );
    res.json({ users: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve users', details: err.message });
  }
});

// PATCH /api/users/me - Update the currently signed-in user's own account.
// Registered before /:id so "me" is never treated as a user id.
router.patch('/me', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, username, avatar, currentPassword, newPassword } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (username) {
      updates.push('username = ?');
      params.push(username);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar);
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to set a new password' });
        return;
      }
      const [rows]: any = await pool.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [userId]);
      if (!rows || rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
      if (!match) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }
      const hash = await bcrypt.hash(newPassword, 10);
      updates.push('password_hash = ?');
      params.push(hash);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields provided' });
      return;
    }

    params.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const [updated]: any = await pool.query(
      'SELECT id, username, name, email, avatar, role, department, status, last_active FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    res.json({ success: true, user: updated[0] });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: `That ${duplicateFieldFromError(err)} is already taken` });
      return;
    }
    res.status(500).json({ error: 'Failed to update account', details: err.message });
  }
});

// POST /api/users - Create user
router.post('/', requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, username, email, password, avatar, role, department } = req.body;
    if (!name || !username || !email || !password) {
      res.status(400).json({ error: 'Name, username, email, and password are required' });
      return;
    }

    const pool = getPool();
    const id = `usr-${Date.now()}`;
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (id, username, name, email, avatar, password_hash, role, department, status, last_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 'Never')`,
      [id, username, name, email, avatar || null, hash, role || 'editor', department || 'General']
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully in MySQL.',
      user: {
        id,
        username,
        name,
        email,
        avatar: avatar || null,
        role: role || 'editor',
        department: department || 'General',
        status: 'active',
      },
    });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: `A user with this ${duplicateFieldFromError(err)} already exists` });
      return;
    }
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// PATCH /api/users/:id - Update another user's profile, role, status, or
// reset their password (admin only).
router.patch('/:id', requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, email, avatar, role, status, department, password } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (username) {
      updates.push('username = ?');
      params.push(username);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar);
    }
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
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      params.push(hash);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields provided' });
      return;
    }

    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ success: true, message: `User ${id} updated.` });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: `A user with this ${duplicateFieldFromError(err)} already exists` });
      return;
    }
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
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
