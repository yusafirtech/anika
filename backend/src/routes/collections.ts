import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Whitelist of collection keys manageable via this generic endpoint.
// 'hero', 'products', 'projects', and 'team' were an earlier, unused
// duplicate catalogue system and have been retired — page content for
// export products/projects/team is managed through /api/pages instead.
const ALLOWED_COLLECTIONS = ['partners'];

// GET /api/collections/:key - Fetch a full collection (array) as JSON.
// Intentionally public/unauthenticated — needed by the live website.
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    if (!ALLOWED_COLLECTIONS.includes(key)) {
      res.status(400).json({ error: `Unknown collection '${key}'` });
      return;
    }

    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT items, updated_at FROM content_collections WHERE collection_key = ? LIMIT 1',
      [key]
    );

    if (!rows || rows.length === 0) {
      res.json({ collectionKey: key, items: [], updatedAt: null });
      return;
    }

    const items = typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items;
    res.json({ collectionKey: key, items, updatedAt: rows[0].updated_at });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve collection', details: err.message });
  }
});

// PUT /api/collections/:key - Replace the full collection (array) in MySQL
router.put('/:key', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    if (!ALLOWED_COLLECTIONS.includes(key)) {
      res.status(400).json({ error: `Unknown collection '${key}'` });
      return;
    }

    const { items } = req.body;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Request body must include an "items" array' });
      return;
    }

    const pool = getPool();
    const jsonString = JSON.stringify(items);

    await pool.query(
      `INSERT INTO content_collections (collection_key, items)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE items = VALUES(items), updated_at = CURRENT_TIMESTAMP`,
      [key, jsonString]
    );

    res.json({
      success: true,
      message: `Collection '${key}' updated successfully in MySQL.`,
      collectionKey: key,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error(`[Collections Error ${req.params.key}]`, err);
    res.status(500).json({ error: 'Failed to save collection to MySQL', details: err.message });
  }
});

export default router;
