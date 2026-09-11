import { Router, Request, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

const STATUSES = ['draft', 'published'];

// Published = status is published and the publish date isn't in the future.
const PUBLISHED_CLAUSE = "status = 'published' AND (published_at IS NULL OR published_at <= NOW())";

function toInsight(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt || '',
    content: row.content || '',
    coverImage: row.cover_image || '',
    relatedProductSlug: row.related_product_slug || '',
    author: row.author || '',
    status: row.status,
    featured: !!row.featured,
    publishedAt: row.published_at,
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    keywords: row.keywords || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 180) || `insight-${Date.now()}`
  );
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const pool = getPool();
  for (let suffix = 1; suffix < 1000; suffix++) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const [rows]: any = await pool.query(
      'SELECT id FROM insights WHERE slug = ? AND id <> ? LIMIT 1',
      [candidate, excludeId || '']
    );
    if (!rows || rows.length === 0) return candidate;
  }
  return `${base}-${Date.now()}`;
}

// Accepts `YYYY-MM-DDTHH:mm` from an <input type="datetime-local"> and turns
// it into a MySQL DATETIME literal.
function toMysqlDatetime(value: unknown): string | null {
  if (!value) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(:\d{2})?/);
  return match ? `${match[1]} ${match[2]}${match[3] || ':00'}` : null;
}

// GET /api/insights - Public list of published insights.
// Optional filters: ?category=&product=&featured=1&limit=
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, product, featured, limit } = req.query;
    const pool = getPool();

    let sql = `SELECT * FROM insights WHERE ${PUBLISHED_CLAUSE}`;
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (product) {
      sql += ' AND related_product_slug = ?';
      params.push(product);
    }
    if (featured === '1') {
      sql += ' AND featured = 1';
    }

    sql += ' ORDER BY featured DESC, COALESCE(published_at, created_at) DESC';

    const parsedLimit = parseInt(String(limit || ''), 10);
    if (parsedLimit > 0) {
      sql += ' LIMIT ?';
      params.push(Math.min(parsedLimit, 100));
    }

    const [rows]: any = await pool.query(sql, params);
    res.json({ insights: rows.map(toInsight) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve insights', details: err.message });
  }
});

// GET /api/insights/manage/all - Every insight including drafts (admin panel)
router.get('/manage/all', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT * FROM insights ORDER BY COALESCE(published_at, created_at) DESC'
    );
    res.json({ insights: rows.map(toInsight) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve insights', details: err.message });
  }
});

// GET /api/insights/:slug - Public single published insight
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      `SELECT * FROM insights WHERE slug = ? AND ${PUBLISHED_CLAUSE} LIMIT 1`,
      [req.params.slug]
    );
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Insight not found' });
      return;
    }
    res.json({ insight: toInsight(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve insight', details: err.message });
  }
});

// POST /api/insights - Create insight (editor and above)
router.post('/', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req: Request, res: Response) => {
  try {
    const b = req.body;
    if (!b.title || !String(b.title).trim()) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const status = STATUSES.includes(b.status) ? b.status : 'draft';
    const slug = await uniqueSlug(slugify(b.slug || b.title));
    const id = `insight-${Date.now()}`;
    const publishedAt = toMysqlDatetime(b.publishedAt) || (status === 'published' ? new Date() : null);

    const pool = getPool();
    await pool.query(
      `INSERT INTO insights
        (id, slug, title, category, excerpt, content, cover_image, related_product_slug, author,
         status, featured, published_at, meta_title, meta_description, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        slug,
        String(b.title).trim(),
        b.category || 'Industry News',
        b.excerpt || null,
        b.content || null,
        b.coverImage || null,
        b.relatedProductSlug || null,
        b.author || null,
        status,
        b.featured ? 1 : 0,
        publishedAt,
        b.metaTitle || null,
        b.metaDescription || null,
        b.keywords || null,
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM insights WHERE id = ? LIMIT 1', [id]);
    res.status(201).json({ success: true, insight: toInsight(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create insight', details: err.message });
  }
});

// PATCH /api/insights/:id - Update insight (editor and above)
router.patch('/:id', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const b = req.body;
    const pool = getPool();

    const [existingRows]: any = await pool.query('SELECT * FROM insights WHERE id = ? LIMIT 1', [id]);
    if (!existingRows || existingRows.length === 0) {
      res.status(404).json({ error: 'Insight not found' });
      return;
    }
    const existing = existingRows[0];

    const fieldMap: Record<string, string> = {
      title: 'title',
      category: 'category',
      excerpt: 'excerpt',
      content: 'content',
      coverImage: 'cover_image',
      relatedProductSlug: 'related_product_slug',
      author: 'author',
      metaTitle: 'meta_title',
      metaDescription: 'meta_description',
      keywords: 'keywords',
    };

    const updates: string[] = [];
    const params: any[] = [];

    for (const [key, column] of Object.entries(fieldMap)) {
      if (b[key] !== undefined) {
        updates.push(`${column} = ?`);
        params.push(b[key] === '' ? null : b[key]);
      }
    }

    if (b.slug !== undefined) {
      updates.push('slug = ?');
      params.push(await uniqueSlug(slugify(b.slug || b.title || existing.title), id));
    }
    if (b.featured !== undefined) {
      updates.push('featured = ?');
      params.push(b.featured ? 1 : 0);
    }
    if (b.status !== undefined && STATUSES.includes(b.status)) {
      updates.push('status = ?');
      params.push(b.status);
      // First publish stamps the publish date if none was set.
      if (b.status === 'published' && !existing.published_at && b.publishedAt === undefined) {
        updates.push('published_at = ?');
        params.push(new Date());
      }
    }
    if (b.publishedAt !== undefined) {
      updates.push('published_at = ?');
      params.push(toMysqlDatetime(b.publishedAt));
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(id);
    await pool.query(`UPDATE insights SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM insights WHERE id = ? LIMIT 1', [id]);
    res.json({ success: true, insight: toInsight(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update insight', details: err.message });
  }
});

// DELETE /api/insights/:id - Delete insight (manager and above)
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM insights WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: `Insight ${req.params.id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete insight', details: err.message });
  }
});

export default router;
