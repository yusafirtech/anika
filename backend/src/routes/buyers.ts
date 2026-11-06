import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { errorDetails } from '../lib/errorDetails.js';

const router = Router();

// All admin-facing buyer-account routes require a signed-in admin session.
router.use(authenticateToken);

// GET /api/buyers - List buyer accounts, with counts of their leads/quotations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const pool = getPool();

    let sql = `
      SELECT
        b.id, b.name, b.company, b.email, b.country, b.phone, b.email_verified, b.created_at,
        (SELECT COUNT(*) FROM leads l WHERE l.buyer_id = b.id) AS lead_count,
        (SELECT COUNT(*) FROM quotations q WHERE q.buyer_id = b.id) AS quotation_count
      FROM buyers b
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ' AND (b.email LIKE ? OR b.name LIKE ? OR b.company LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY b.created_at DESC';

    const [rows]: any = await pool.query(sql, params);
    res.json({
      buyers: rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        company: row.company,
        email: row.email,
        country: row.country,
        phone: row.phone,
        emailVerified: !!row.email_verified,
        leadCount: row.lead_count,
        quotationCount: row.quotation_count,
        createdAt: row.created_at,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve buyer accounts', details: errorDetails(err) });
  }
});

// PATCH /api/buyers/:id - Manually verify (useful if SMTP isn't configured
// yet, or email delivery failed) (admin/manager)
router.patch('/:id', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emailVerified } = req.body;
    if (typeof emailVerified !== 'boolean') {
      res.status(400).json({ error: 'emailVerified (boolean) is required.' });
      return;
    }

    const pool = getPool();
    await pool.query('UPDATE buyers SET email_verified = ? WHERE id = ?', [emailVerified ? 1 : 0, id]);
    res.json({ success: true, message: `Buyer ${id} updated.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update buyer account', details: errorDetails(err) });
  }
});

// DELETE /api/buyers/:id - Remove a buyer account (admin/manager)
router.delete('/:id', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM buyers WHERE id = ?', [id]);
    res.json({ success: true, message: `Buyer ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete buyer account', details: errorDetails(err) });
  }
});

export default router;
