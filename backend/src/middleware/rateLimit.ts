import rateLimit from 'express-rate-limit';

// Applied to login endpoints (admin + buyer) — generous enough for a
// genuine user mistyping a password a few times, strict enough to make
// brute-forcing impractical.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

// Applied to endpoints that send an email (register, forgot-password,
// resend-verification) — these are unauthenticated and each hit costs an
// outbound email, so they need a tighter limit to prevent email-bombing a
// victim's inbox or running up SMTP usage.
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
