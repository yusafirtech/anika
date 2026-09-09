import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// GET routes below are intentionally public/unauthenticated — the live
// website fetches page content on every request, unauthenticated.

// GET /api/pages - List all pages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT page_key, updated_at FROM pages_content ORDER BY page_key ASC'
    );
    res.json({ pages: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve pages list', details: err.message });
  }
});

// GET /api/pages/:pageKey - Fetch specific page content
router.get('/:pageKey', async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT content, updated_at FROM pages_content WHERE page_key = ? LIMIT 1',
      [pageKey]
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: `Page content for '${pageKey}' not found` });
      return;
    }

    const pageContent = typeof rows[0].content === 'string'
      ? JSON.parse(rows[0].content)
      : rows[0].content;

    res.json({
      pageKey,
      content: pageContent,
      updatedAt: rows[0].updated_at,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve page content', details: err.message });
  }
});

// PUT /api/pages/:pageKey - Update specific page content
router.put('/:pageKey', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Content payload is required' });
      return;
    }

    const pool = getPool();
    const jsonString = JSON.stringify(content);

    await pool.query(
      `INSERT INTO pages_content (page_key, content)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = CURRENT_TIMESTAMP`,
      [pageKey, jsonString]
    );

    res.json({
      success: true,
      message: `Page '${pageKey}' updated successfully in MySQL.`,
      pageKey,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error(`[Pages Error ${req.params.pageKey}]`, err);
    res.status(500).json({ error: 'Failed to save page content to MySQL', details: err.message });
  }
});

export default router;
