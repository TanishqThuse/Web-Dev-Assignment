const { v4: uuidv4 } = require('uuid');

function requestLogger(req, res, next) {
  const reqId = uuidv4();
  const start = Date.now();
  req.reqId = reqId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      reqId,
      method: req.method,
      route: req.originalUrl,
      userId: (req.user && req.user.id) || null,
      status: res.statusCode,
      latencyMs: duration
    };
    console.log(JSON.stringify(log));
  });

  next();
}

module.exports = requestLogger;
