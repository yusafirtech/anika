import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthBuyer {
  id: string;
  name: string;
  email: string;
  type: 'buyer';
}

export interface BuyerAuthenticatedRequest extends Request {
  buyer?: AuthBuyer;
}

const JWT_SECRET = process.env.JWT_SECRET || 'anika_trading_super_secret_jwt_key_2026';

// Separate from the admin `authenticateToken` middleware so a buyer's token
// can never be used against admin-only routes and vice versa — the admin
// JWT payload carries `role`, the buyer payload carries `type: 'buyer'`, and
// each middleware checks for its own shape only.
export function authenticateBuyerToken(
  req: BuyerAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded || typeof decoded !== 'object' || (decoded as any).type !== 'buyer') {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    req.buyer = decoded as AuthBuyer;
    next();
  });
}

// Like authenticateBuyerToken, but never rejects — just populates req.buyer
// when a valid buyer token is present. Used on public routes (e.g.
// submitting an RFQ) that work for guests but should tag the submitter when
// they happen to be logged in.
export function optionalBuyerToken(req: BuyerAuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    next();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded && typeof decoded === 'object' && (decoded as any).type === 'buyer') {
      req.buyer = decoded as AuthBuyer;
    }
    next();
  });
}
