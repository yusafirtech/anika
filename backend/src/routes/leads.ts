import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/leads - List and filter leads (admin panel only)
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, sector, search } = req.query;
    const pool = getPool();

    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (sector && sector !== 'All') {
      sql += ' AND sector = ?';
      params.push(sector);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ? OR message LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows]: any = await pool.query(sql, params);
    res.json({ leads: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve leads', details: err.message });
  }
});

// POST /api/leads - Create new lead. Intentionally public/unauthenticated —
// this is the endpoint the public site's contact form submits to.
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, sector, budget, message } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required.' });
      return;
    }

    const pool = getPool();
    const id = `lead-${Date.now()}`;

    await pool.query(
      `INSERT INTO leads (id, name, company, email, phone, sector, status, budget, message, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, '', NOW())`,
      [id, name, company || '', email, phone || '', sector || 'General', budget || '', message || '']
    );

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully.',
      leadId: id,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit inquiry', details: err.message });
  }
});

// PATCH /api/leads/:id - Update lead status or notes
router.patch('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(id);
    await pool.query(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ success: true, message: `Lead ${id} updated successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update lead', details: err.message });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM leads WHERE id = ?', [id]);
    res.json({ success: true, message: `Lead ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete lead', details: err.message });
  }
});

export default router;
