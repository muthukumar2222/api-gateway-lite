const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting state — sliding window
const clients = new Map();

function rateLimit(windowMs, max) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    let record = clients.get(key);

    if (!record) {
      record = { timestamps: [] };
      clients.set(key, record);
    }

    // Sliding window: drop timestamps outside the window
    record.timestamps = record.timestamps.filter(t => now - t < windowMs);
    record.timestamps.push(now);

    const remaining = Math.max(0, max - record.timestamps.length);

    if (record.timestamps.length > max) {
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    res.setHeader('X-RateLimit-Remaining', remaining);
    next();
  };
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Proxy with rate limiting
app.use('/api',
  rateLimit(
    parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
    parseInt(process.env.RATE_LIMIT_MAX) || 100
  ),
  createProxyMiddleware({
    target: process.env.UPSTREAM_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '/v2' },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.API_KEY}`);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Gateway listening on :${PORT}`);
});
