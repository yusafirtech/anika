import { Router, Response } from 'express';
import { getPool } from '../db/connection.js';
import { authenticateBuyerToken, BuyerAuthenticatedRequest } from '../middleware/buyerAuth.js';
import { mapRow as mapQuotationRow, streamQuotationPdf } from './quotations.js';
import { errorDetails } from '../lib/errorDetails.js';

const router = Router();

// All buyer-portal routes require a signed-in buyer session.
router.use(authenticateBuyerToken);

// GET /api/buyer/leads - The logged-in buyer's own submitted inquiries/RFQs
router.get('/leads', async (req: BuyerAuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT * FROM leads WHERE buyer_id = ? ORDER BY created_at DESC',
      [req.buyer?.id]
    );
    res.json({
      leads: rows.map((row: any) => ({
        id: row.id,
        requestType: row.request_type,
        productSlug: row.product_slug,
        subject: row.subject,
        sector: row.sector,
        quantity: row.quantity,
        quantityUnit: row.quantity_unit,
        incoterm: row.incoterm,
        destinationPort: row.destination_port,
        paymentTerms: row.payment_terms,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve your inquiries', details: errorDetails(err) });
  }
});

// GET /api/buyer/quotations - The logged-in buyer's own quotations
router.get('/quotations', async (req: BuyerAuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT * FROM quotations WHERE buyer_id = ? ORDER BY created_at DESC',
      [req.buyer?.id]
    );
    res.json({ quotations: rows.map(mapQuotationRow) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve your quotations', details: errorDetails(err) });
  }
});

// GET /api/buyer/quotations/:id/pdf - Download own quotation PDF (ownership checked)
router.get('/quotations/:id/pdf', async (req: BuyerAuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT buyer_id FROM quotations WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (!rows || rows.length === 0 || rows[0].buyer_id !== req.buyer?.id) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    await streamQuotationPdf(String(req.params.id), res);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate PDF', details: errorDetails(err) });
  }
});

export default router;
