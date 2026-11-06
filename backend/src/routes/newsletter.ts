import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { errorDetails } from '../lib/errorDetails.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter - Subscribe. Intentionally public/unauthenticated —
// this is the endpoint the public site's subscribe form submits to.
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const pool = getPool();
    const normalizedEmail = String(email).trim().toLowerCase();
    const id = `sub-${Date.now()}`;

    await pool.query(
      `INSERT INTO newsletter_subscribers (id, email, name, source, status, subscribed_at)
       VALUES (?, ?, ?, ?, 'active', NOW())
       ON DUPLICATE KEY UPDATE status = 'active', unsubscribed_at = NULL, name = COALESCE(VALUES(name), name)`,
      [id, normalizedEmail, name || null, source || null]
    );

    res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to subscribe', details: errorDetails(err) });
  }
});

// GET /api/newsletter - List subscribers (admin panel only — never public,
// since this is personal contact data).
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const pool = getPool();

    let sql = 'SELECT * FROM newsletter_subscribers WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (email LIKE ? OR name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY subscribed_at DESC';

    const [rows]: any = await pool.query(sql, params);
    res.json({ subscribers: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve subscribers', details: errorDetails(err) });
  }
});

// DELETE /api/newsletter/:id - Remove a subscriber (admin/manager)
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
    res.json({ success: true, message: `Subscriber ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete subscriber', details: errorDetails(err) });
  }
});

export default router;
