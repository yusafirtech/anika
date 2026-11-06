import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getPool } from '../db/connection.js';
import { authenticateBuyerToken, BuyerAuthenticatedRequest } from '../middleware/buyerAuth.js';
import { sendMail } from '../lib/mailer.js';
import { loginLimiter, emailLimiter } from '../middleware/rateLimit.js';
import { errorDetails } from '../lib/errorDetails.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'anika_trading_super_secret_jwt_key_2026';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error(
    '[SECURITY WARNING] JWT_SECRET is not set in production — falling back to the publicly-known ' +
      'default secret. Anyone can forge valid buyer tokens until you set JWT_SECRET in your .env.'
  );
}
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function signBuyerToken(buyer: { id: string; name: string; email: string }) {
  return jwt.sign({ id: buyer.id, name: buyer.name, email: buyer.email, type: 'buyer' }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

// MySQL returns DATETIME as a naive string (no timezone marker), and
// `new Date(thatString)` parses it as local time. So this must write using
// local components too — writing UTC components here (e.g. via
// toISOString()) would silently shift the stored instant by the server's
// UTC offset when read back, which is especially dangerous for the 1-hour
// reset-token TTL (a token could appear expired the instant it's issued).
function toMysqlDatetime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${SITE_URL}/account/verify?token=${token}`;
  await sendMail({
    to,
    subject: 'Verify your ANIKA TRADING & CO. buyer account',
    html: `<p>Hi ${name},</p><p>Please confirm your email address to activate your buyer account:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`,
    text: `Hi ${name}, please verify your email: ${link} (expires in 24 hours)`,
  });
}

async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${SITE_URL}/account/reset-password?token=${token}`;
  await sendMail({
    to,
    subject: 'Reset your ANIKA TRADING & CO. password',
    html: `<p>Hi ${name},</p><p>We received a request to reset your password. Click below to choose a new one:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
    text: `Hi ${name}, reset your password: ${link} (expires in 1 hour). If you didn't request this, ignore this email.`,
  });
}

// POST /api/buyer-auth/register
router.post('/register', emailLimiter, async (req: Request, res: Response) => {
  try {
    const { name, company, email, password, country, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required.' });
      return;
    }
    if (!EMAIL_RE.test(String(email).trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (String(password).length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const pool = getPool();
    const normalizedEmail = String(email).trim().toLowerCase();

    const [existing]: any = await pool.query('SELECT id FROM buyers WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existing && existing.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
      return;
    }

    const id = `buyer-${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = toMysqlDatetime(new Date(Date.now() + VERIFICATION_TTL_MS));

    await pool.query(
      `INSERT INTO buyers (id, name, company, email, password_hash, country, phone, verification_token, verification_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, company || null, normalizedEmail, passwordHash, country || null, phone || null, verificationToken, verificationExpires]
    );

    sendVerificationEmail(normalizedEmail, name, verificationToken).catch((err) =>
      console.error('[Buyer Register] Failed to send verification email:', err)
    );

    const buyer = { id, name, email: normalizedEmail };
    const token = signBuyerToken(buyer);

    res.status(201).json({
      token,
      buyer: {
        id,
        name,
        company: company || null,
        email: normalizedEmail,
        country: country || null,
        emailVerified: false,
      },
    });
  } catch (err: any) {
    console.error('[Buyer Register Error]', err);
    res.status(500).json({ error: 'Failed to create account', details: errorDetails(err) });
  }
});

// POST /api/buyer-auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const pool = getPool();
    const normalizedEmail = String(email).trim().toLowerCase();
    const [rows]: any = await pool.query('SELECT * FROM buyers WHERE email = ? LIMIT 1', [normalizedEmail]);
    const buyer = rows && rows[0];

    if (!buyer) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, buyer.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = signBuyerToken(buyer);

    res.json({
      token,
      buyer: {
        id: buyer.id,
        name: buyer.name,
        company: buyer.company,
        email: buyer.email,
        country: buyer.country,
        emailVerified: !!buyer.email_verified,
      },
    });
  } catch (err: any) {
    console.error('[Buyer Login Error]', err);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// GET /api/buyer-auth/me
router.get('/me', authenticateBuyerToken, async (req: BuyerAuthenticatedRequest, res: Response) => {
  try {
    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, name, company, email, country, phone, email_verified, created_at FROM buyers WHERE id = ? LIMIT 1',
      [req.buyer?.id]
    );
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    const buyer = rows[0];
    res.json({ buyer: { ...buyer, emailVerified: !!buyer.email_verified } });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// GET /api/buyer-auth/verify?token=... - Confirm email address
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const pool = getPool();
    const [rows]: any = await pool.query(
      'SELECT id, verification_expires FROM buyers WHERE verification_token = ? LIMIT 1',
      [token]
    );
    const buyer = rows && rows[0];
    if (!buyer) {
      res.status(400).json({ error: 'Invalid or already-used verification link.' });
      return;
    }
    if (buyer.verification_expires && new Date(buyer.verification_expires).getTime() < Date.now()) {
      res.status(400).json({ error: 'This verification link has expired. Please request a new one.' });
      return;
    }

    await pool.query(
      'UPDATE buyers SET email_verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?',
      [buyer.id]
    );

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify email', details: errorDetails(err) });
  }
});

// POST /api/buyer-auth/resend-verification - Logged-in buyer requests a new link
router.post(
  '/resend-verification',
  emailLimiter,
  authenticateBuyerToken,
  async (req: BuyerAuthenticatedRequest, res: Response) => {
    try {
      const pool = getPool();
      const [rows]: any = await pool.query(
        'SELECT name, email, email_verified FROM buyers WHERE id = ? LIMIT 1',
        [req.buyer?.id]
      );
      const buyer = rows && rows[0];
      if (!buyer) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      if (buyer.email_verified) {
        res.json({ success: true, message: 'Your email is already verified.' });
        return;
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = toMysqlDatetime(new Date(Date.now() + VERIFICATION_TTL_MS));
      await pool.query('UPDATE buyers SET verification_token = ?, verification_expires = ? WHERE id = ?', [
        verificationToken,
        verificationExpires,
        req.buyer?.id,
      ]);

      await sendVerificationEmail(buyer.email, buyer.name, verificationToken);
      res.json({ success: true, message: 'Verification email sent.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to resend verification email', details: errorDetails(err) });
    }
  }
);

// POST /api/buyer-auth/forgot-password - Always responds with a generic
// success message regardless of whether the email exists, to avoid leaking
// which addresses have accounts.
router.post('/forgot-password', emailLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const pool = getPool();
    const normalizedEmail = String(email).trim().toLowerCase();
    const [rows]: any = await pool.query('SELECT id, name FROM buyers WHERE email = ? LIMIT 1', [normalizedEmail]);
    const buyer = rows && rows[0];

    if (buyer) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = toMysqlDatetime(new Date(Date.now() + RESET_TTL_MS));
      await pool.query('UPDATE buyers SET reset_token = ?, reset_expires = ? WHERE id = ?', [
        resetToken,
        resetExpires,
        buyer.id,
      ]);
      await sendPasswordResetEmail(normalizedEmail, buyer.name, resetToken);
    }

    res.json({
      success: true,
      message: 'If an account exists for that email, a password reset link has been sent.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process request', details: errorDetails(err) });
  }
});

// POST /api/buyer-auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ error: 'Token and new password are required.' });
      return;
    }
    if (String(password).length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const pool = getPool();
    const [rows]: any = await pool.query('SELECT id, reset_expires FROM buyers WHERE reset_token = ? LIMIT 1', [
      token,
    ]);
    const buyer = rows && rows[0];
    if (!buyer) {
      res.status(400).json({ error: 'Invalid or already-used reset link.' });
      return;
    }
    if (buyer.reset_expires && new Date(buyer.reset_expires).getTime() < Date.now()) {
      res.status(400).json({ error: 'This reset link has expired. Please request a new one.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE buyers SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [passwordHash, buyer.id]
    );

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset password', details: errorDetails(err) });
  }
});

export default router;
