const { rateLimit } = require('express-rate-limit');

// General API limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again in 15 minutes.' }
});

// Strict limiter for ingest: 10 scans per hour per IP
// Protects GitHub token + Gemini API credits from abuse
const ingestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many scans. You can analyze up to 10 repos per hour.' }
});

// Strict limiter for chat: 30 questions per 5 minutes per IP
const chatLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Slow down! Too many questions. Please wait a few minutes.' }
});

module.exports = { apiLimiter, ingestLimiter, chatLimiter };
