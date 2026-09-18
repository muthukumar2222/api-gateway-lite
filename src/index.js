const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { requestLogger } = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestLogger());

// Rate limiting state
const clients = new Map();

function rateLimit(windowMs, max) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const record = clients.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count++;
    clients.set(key, record);

    if (record.count > max) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    res.setHeader('X-RateLimit-Remaining', max - record.count);
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
