import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// All client routes require a signed-in session — this is internal business
// data, never read by the public site.
router.use(authenticateToken);

// GET /api/clients - List and filter clients
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, sector, search } = req.query;
    const pool = getPool();

    let sql = 'SELECT * FROM clients WHERE 1=1';
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
      sql += ' AND (name LIKE ? OR contact_person LIKE ? OR email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows]: any = await pool.query(sql, params);
    res.json({ clients: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve clients', details: err.message });
  }
});

// POST /api/clients - Create client (admin/manager)
router.post('/', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { name, contactPerson, email, phone, address, sector, status, logo, clientSince, notes } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Client name is required' });
      return;
    }

    const pool = getPool();
    const id = `client-${Date.now()}`;

    await pool.query(
      `INSERT INTO clients (id, name, contact_person, email, phone, address, sector, status, logo, client_since, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        contactPerson || null,
        email || null,
        phone || null,
        address || null,
        sector || null,
        status || 'Active',
        logo || null,
        clientSince || null,
        notes || null,
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);

    res.status(201).json({
      success: true,
      message: 'Client created successfully in MySQL.',
      client: rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create client', details: err.message });
  }
});

// PATCH /api/clients/:id - Update client (admin/manager/editor)
router.patch('/:id', requireRole(['admin', 'manager', 'editor']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, contactPerson, email, phone, address, sector, status, logo, clientSince, notes } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (contactPerson !== undefined) {
      updates.push('contact_person = ?');
      params.push(contactPerson);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address);
    }
    if (sector !== undefined) {
      updates.push('sector = ?');
      params.push(sector);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (logo !== undefined) {
      updates.push('logo = ?');
      params.push(logo);
    }
    if (clientSince !== undefined) {
      updates.push('client_since = ?');
      params.push(clientSince || null);
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
    await pool.query(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ success: true, message: `Client ${id} updated successfully.`, client: rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update client', details: err.message });
  }
});

// DELETE /api/clients/:id - Delete client (admin/manager)
router.delete('/:id', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ success: true, message: `Client ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete client', details: err.message });
  }
});

export default router;
