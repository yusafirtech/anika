import { Router, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { getPool } from '../db/connection.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import type { QuotationLineItem, QuotationStatus } from '../types.js';
import { errorDetails } from '../lib/errorDetails.js';

const router = Router();

const STATUSES: QuotationStatus[] = ['draft', 'sent', 'accepted', 'expired'];

// All quotation routes require a signed-in session — this is internal
// commercial data, never read by the public site.
router.use(authenticateToken);

function parseLineItems(value: any): QuotationLineItem[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function mapRow(row: any) {
  return {
    id: row.id,
    quoteNumber: row.quote_number,
    leadId: row.lead_id || undefined,
    buyerId: row.buyer_id || undefined,
    status: row.status,
    buyerName: row.buyer_name,
    buyerCompany: row.buyer_company || undefined,
    buyerEmail: row.buyer_email,
    buyerCountry: row.buyer_country || undefined,
    lineItems: parseLineItems(row.line_items),
    currency: row.currency,
    incoterm: row.incoterm || undefined,
    destinationPort: row.destination_port || undefined,
    paymentTerms: row.payment_terms || undefined,
    validUntil: row.valid_until || undefined,
    notes: row.notes || undefined,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function nextQuoteNumber(): Promise<string> {
  const pool = getPool();
  const year = new Date().getFullYear();
  const [rows]: any = await pool.query(
    "SELECT COUNT(*) AS count FROM quotations WHERE quote_number LIKE ?",
    [`ANIKA-Q-${year}-%`]
  );
  const seq = (rows?.[0]?.count ?? 0) + 1;
  return `ANIKA-Q-${year}-${String(seq).padStart(4, '0')}`;
}

// GET /api/quotations - List and filter quotations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, leadId, search } = req.query;
    const pool = getPool();

    let sql = 'SELECT * FROM quotations WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (leadId) {
      sql += ' AND lead_id = ?';
      params.push(leadId);
    }

    if (search) {
      sql += ' AND (quote_number LIKE ? OR buyer_name LIKE ? OR buyer_company LIKE ? OR buyer_email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows]: any = await pool.query(sql, params);
    res.json({ quotations: rows.map(mapRow) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve quotations', details: errorDetails(err) });
  }
});

// GET /api/quotations/:id - Fetch a single quotation
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT * FROM quotations WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    res.json({ quotation: mapRow(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve quotation', details: errorDetails(err) });
  }
});

// POST /api/quotations - Create a quotation (admin/manager)
router.post('/', requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      leadId,
      buyerId,
      buyerName,
      buyerCompany,
      buyerEmail,
      buyerCountry,
      lineItems,
      currency,
      incoterm,
      destinationPort,
      paymentTerms,
      validUntil,
      notes,
      status,
    } = req.body;

    if (!buyerName || !buyerEmail) {
      res.status(400).json({ error: 'Buyer name and email are required.' });
      return;
    }
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      res.status(400).json({ error: 'At least one line item is required.' });
      return;
    }

    const pool = getPool();
    const id = `quote-${Date.now()}`;
    const quoteNumber = await nextQuoteNumber();
    const resolvedStatus: QuotationStatus = STATUSES.includes(status) ? status : 'draft';

    // A quote built from a lead inherits that lead's buyer account link (if
    // any) automatically, so it shows up in that buyer's portal dashboard —
    // the admin building the quote doesn't need to know the buyer's id.
    let resolvedBuyerId: string | null = buyerId || null;
    if (!resolvedBuyerId && leadId) {
      const [leadRows]: any = await pool.query('SELECT buyer_id FROM leads WHERE id = ? LIMIT 1', [leadId]);
      resolvedBuyerId = leadRows?.[0]?.buyer_id || null;
    }

    await pool.query(
      `INSERT INTO quotations (
        id, quote_number, lead_id, buyer_id, status, buyer_name, buyer_company, buyer_email, buyer_country,
        line_items, currency, incoterm, destination_port, payment_terms, valid_until, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        quoteNumber,
        leadId || null,
        resolvedBuyerId,
        resolvedStatus,
        buyerName,
        buyerCompany || null,
        buyerEmail,
        buyerCountry || null,
        JSON.stringify(lineItems),
        currency || 'USD',
        incoterm || null,
        destinationPort || null,
        paymentTerms || null,
        validUntil || null,
        notes || null,
        req.user?.id || null,
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM quotations WHERE id = ? LIMIT 1', [id]);
    res.status(201).json({ success: true, message: 'Quotation created.', quotation: mapRow(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create quotation', details: errorDetails(err) });
  }
});

// PATCH /api/quotations/:id - Update a quotation (admin/manager)
router.patch('/:id', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      buyerName,
      buyerCompany,
      buyerEmail,
      buyerCountry,
      lineItems,
      currency,
      incoterm,
      destinationPort,
      paymentTerms,
      validUntil,
      notes,
      status,
    } = req.body;
    const pool = getPool();

    const updates: string[] = [];
    const params: any[] = [];

    if (buyerName !== undefined) { updates.push('buyer_name = ?'); params.push(buyerName); }
    if (buyerCompany !== undefined) { updates.push('buyer_company = ?'); params.push(buyerCompany); }
    if (buyerEmail !== undefined) { updates.push('buyer_email = ?'); params.push(buyerEmail); }
    if (buyerCountry !== undefined) { updates.push('buyer_country = ?'); params.push(buyerCountry); }
    if (lineItems !== undefined) { updates.push('line_items = ?'); params.push(JSON.stringify(lineItems)); }
    if (currency !== undefined) { updates.push('currency = ?'); params.push(currency); }
    if (incoterm !== undefined) { updates.push('incoterm = ?'); params.push(incoterm); }
    if (destinationPort !== undefined) { updates.push('destination_port = ?'); params.push(destinationPort); }
    if (paymentTerms !== undefined) { updates.push('payment_terms = ?'); params.push(paymentTerms); }
    if (validUntil !== undefined) { updates.push('valid_until = ?'); params.push(validUntil || null); }
    if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
    if (status !== undefined && STATUSES.includes(status)) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(id);
    await pool.query(`UPDATE quotations SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows]: any = await pool.query('SELECT * FROM quotations WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }

    res.json({ success: true, message: `Quotation ${id} updated.`, quotation: mapRow(rows[0]) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update quotation', details: errorDetails(err) });
  }
});

// DELETE /api/quotations/:id - Delete a quotation (admin/manager)
router.delete('/:id', requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.query('DELETE FROM quotations WHERE id = ?', [id]);
    res.json({ success: true, message: `Quotation ${id} deleted.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete quotation', details: errorDetails(err) });
  }
});

// Fetches a quotation by id and, if found, generates and streams its PDF
// onto the given response. Returns false (without writing a response body)
// if the quotation doesn't exist, so callers can send their own 404.
// Shared by this router's own /:id/pdf route and the buyer-portal's
// ownership-checked equivalent in routes/buyer.ts.
export async function streamQuotationPdf(id: string, res: Response): Promise<boolean> {
  const pool = getPool();
  const [rows]: any = await pool.query('SELECT * FROM quotations WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) {
    return false;
  }
  const quotation = mapRow(rows[0]);

  {
    const [siteRows]: any = await pool.query(
      "SELECT content FROM pages_content WHERE page_key = 'site' LIMIT 1"
    );
    const siteContent = siteRows?.[0]?.content
      ? (typeof siteRows[0].content === 'string' ? JSON.parse(siteRows[0].content) : siteRows[0].content)
      : null;
    const company = siteContent?.companyInfo || {
      name: 'ANIKA TRADING & CO.',
      address: '',
      phone: '',
      email: '',
    };
    const credentials = siteContent?.credentials || {};

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${quotation.quoteNumber}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // Letterhead
    doc.fontSize(18).fillColor('#0f2a4a').text(company.name || 'ANIKA TRADING & CO.', { continued: false });
    doc.fontSize(9).fillColor('#555555');
    if (company.address) doc.text(company.address);
    const contactLine = [company.phone, company.email].filter(Boolean).join('  |  ');
    if (contactLine) doc.text(contactLine);
    doc.moveDown(1);

    doc.fontSize(14).fillColor('#0f2a4a').text('COMMERCIAL QUOTATION', { align: 'right' });
    doc.fontSize(10).fillColor('#555555').text(`Quote No: ${quotation.quoteNumber}`, { align: 'right' });
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, { align: 'right' });
    if (quotation.validUntil) {
      doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, { align: 'right' });
    }
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#dddddd').stroke();
    doc.moveDown(1);

    // Buyer block
    doc.fontSize(10).fillColor('#888888').text('QUOTED TO');
    doc.fontSize(11).fillColor('#0f2a4a').text(quotation.buyerCompany || quotation.buyerName);
    doc.fontSize(10).fillColor('#333333');
    doc.text(quotation.buyerName);
    doc.text(quotation.buyerEmail);
    if (quotation.buyerCountry) doc.text(quotation.buyerCountry);
    doc.moveDown(1);

    // Terms block
    const terms = [
      quotation.incoterm ? `Incoterm: ${quotation.incoterm}` : null,
      quotation.destinationPort ? `Destination Port: ${quotation.destinationPort}` : null,
      quotation.paymentTerms ? `Payment Terms: ${quotation.paymentTerms}` : null,
      `Currency: ${quotation.currency}`,
    ].filter(Boolean) as string[];
    doc.fontSize(9).fillColor('#555555').text(terms.join('   |   '));
    doc.moveDown(1);

    // Line items table
    const tableTop = doc.y;
    const colX = { desc: 50, hs: 260, qty: 330, price: 400, total: 475 };
    doc.fontSize(9).fillColor('#ffffff');
    doc.rect(50, tableTop, 495, 20).fill('#0f2a4a');
    doc.fillColor('#ffffff');
    doc.text('Description', colX.desc + 5, tableTop + 5);
    doc.text('HS Code', colX.hs, tableTop + 5);
    doc.text('Qty', colX.qty, tableTop + 5);
    doc.text('Unit Price', colX.price, tableTop + 5);
    doc.text('Line Total', colX.total, tableTop + 5);

    let y = tableTop + 20;
    let subtotal = 0;
    doc.fillColor('#333333').fontSize(9);
    quotation.lineItems.forEach((item, idx) => {
      const qtyNum = parseFloat(item.quantity) || 0;
      const lineTotal = qtyNum * (item.unitPrice || 0);
      subtotal += lineTotal;
      const rowHeight = 22;
      if (idx % 2 === 1) {
        doc.rect(50, y, 495, rowHeight).fill('#f5f7fa');
        doc.fillColor('#333333');
      }
      doc.text(item.description, colX.desc + 5, y + 6, { width: 200 });
      doc.text(item.hsCode || '-', colX.hs, y + 6, { width: 60 });
      doc.text(`${item.quantity} ${item.unit}`, colX.qty, y + 6, { width: 65 });
      doc.text(`${quotation.currency} ${item.unitPrice.toFixed(2)}`, colX.price, y + 6, { width: 70 });
      doc.text(`${quotation.currency} ${lineTotal.toFixed(2)}`, colX.total, y + 6, { width: 70 });
      y += rowHeight;
    });

    doc.moveTo(50, y).lineTo(545, y).strokeColor('#dddddd').stroke();
    y += 10;
    doc.fontSize(11).fillColor('#0f2a4a').text(`Subtotal: ${quotation.currency} ${subtotal.toFixed(2)}`, colX.price - 40, y, {
      align: 'right',
      width: 180,
    });
    doc.y = y + 30;

    if (quotation.notes) {
      doc.moveDown(1);
      doc.fontSize(9).fillColor('#888888').text('NOTES');
      doc.fontSize(10).fillColor('#333333').text(quotation.notes);
    }

    // Banking footer (for LC advising) if available
    if (credentials.bankName || credentials.swiftCode) {
      doc.moveDown(1.5);
      doc.fontSize(9).fillColor('#888888').text('BANKING DETAILS (FOR LC ADVISING)');
      doc.fontSize(9).fillColor('#333333');
      if (credentials.bankName) doc.text(`Bank: ${credentials.bankName}`);
      if (credentials.bankBranch) doc.text(`Branch: ${credentials.bankBranch}`);
      if (credentials.swiftCode) doc.text(`SWIFT/BIC: ${credentials.swiftCode}`);
    }

    doc.moveDown(2);
    doc.fontSize(8).fillColor('#999999').text(
      'This quotation is subject to final confirmation and does not constitute a binding contract until formally accepted in writing.',
      { align: 'center' }
    );

    doc.end();
  }

  return true;
}

// GET /api/quotations/:id/pdf - Generate and stream a branded PDF
router.get('/:id/pdf', async (req: Request, res: Response) => {
  try {
    const found = await streamQuotationPdf(String(req.params.id), res);
    if (!found) {
      res.status(404).json({ error: 'Quotation not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate PDF', details: errorDetails(err) });
  }
});

export default router;
