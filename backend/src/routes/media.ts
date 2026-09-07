import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getPool } from '../db/connection.js';

const router = Router();

// Configure Multer with memory storage so image buffer is kept in RAM
// and inserted directly into MySQL LONGBLOB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
  fileFilter: (_req, file, cb) => {
    // Allow images and common media formats
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) and PDF are allowed.'));
    }
  },
});

// POST /api/upload - Upload file directly into MySQL database LONGBLOB
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // Generate clean safe filename
    const cleanName = originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
    const filename = `img-${Date.now()}-${cleanName}`;
    const url = `/api/media/${filename}`;

    const pool = getPool();
    const [result]: any = await pool.query(
      `INSERT INTO media_uploads (filename, original_name, mime_type, file_size, image_data, url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [filename, originalname, mimetype, size, buffer, url]
    );

    console.log(`[MySQL Media] Stored image '${filename}' (${size} bytes) as LONGBLOB.`);

    res.status(201).json({
      success: true,
      message: 'Image uploaded and stored in MySQL successfully.',
      id: result.insertId,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      url,
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    res.status(500).json({ error: 'Failed to upload and store image in MySQL', details: err.message });
  }
});

// GET /api/media/:filename - Stream image binary data directly from MySQL LONGBLOB
router.get('/media/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const pool = getPool();

    const [rows]: any = await pool.query(
      'SELECT mime_type, file_size, image_data FROM media_uploads WHERE filename = ? LIMIT 1',
      [filename]
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: `Image '${filename}' not found in database.` });
      return;
    }

    const media = rows[0];
    const buffer = Buffer.from(media.image_data);

    res.setHeader('Content-Type', media.mime_type);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(buffer);
  } catch (err: any) {
    console.error('[Media Stream Error]', err);
    res.status(500).json({ error: 'Failed to retrieve image from database', details: err.message });
  }
});

// GET /api/media - List all uploaded images stored in MySQL
router.get('/media', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      `SELECT id, filename, original_name, mime_type, file_size, url, created_at
       FROM media_uploads
       ORDER BY id DESC`
    );
    res.json({ media: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list media from database', details: err.message });
  }
});

// DELETE /api/media/:id - Remove image from MySQL
router.delete('/media/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM media_uploads WHERE id = ?', [id]);
    res.json({ success: true, message: `Media item #${id} deleted from database.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete media', details: err.message });
  }
});

export default router;
