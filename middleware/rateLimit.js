import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { AppError } from './errorHandler.js';

export const createUserRateLimiter = (windowMs = 15 * 60 * 1000, max = 5) => {
  return rateLimit({
    windowMs,
    limit: max,
    keyGenerator: (req) => req.userId || ipKeyGenerator(req),
    handler: (req, res, next) => {
      next(new AppError(`Too many requests. Try again in ${Math.ceil(windowMs / 60000)} minutes.`, 429));
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

export const loginRateLimiter = createUserRateLimiter(15 * 60 * 1000, 5); // 5 login attempts per 15 mins

export const authRateLimiter = createUserRateLimiter(60 * 60 * 1000, 100); // 100 auth req per hour per user/IP

// General API limiter: 100 requests per 15 minutes
export const apiRateLimiter = createUserRateLimiter(15 * 60 * 1000, 100);

// Strict limiter for AI Chat to control Groq API costs: 15 requests per hour
export const chatRateLimiter = createUserRateLimiter(60 * 60 * 1000, 15);

// Limiter for contact form submissions to prevent spam: 5 per hour
export const contactRateLimiter = createUserRateLimiter(60 * 60 * 1000, 5);
