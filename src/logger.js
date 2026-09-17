const crypto = require('crypto');

function requestLogger() {
  return (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    const start = Date.now();

    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    res.on('finish', () => {
      const duration = Date.now() - start;
      const entry = {
        ts: new Date().toISOString(),
        cid: correlationId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms: duration,
        ip: req.ip,
      };
      process.stdout.write(JSON.stringify(entry) + '\n');
    });

    next();
  };
}

module.exports = { requestLogger };
