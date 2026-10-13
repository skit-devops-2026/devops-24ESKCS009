const express = require('express');
const router = express.Router();
const client = require('prom-client');

// Initialize Prometheus registry
const register = new client.Registry();

// Enable standard Node.js runtime metrics (CPU, Memory, Event Loop, GC)
client.collectDefaultMetrics({
  app: 'hirehub-job-portal',
  prefix: 'node_',
  timeout: 10000,
  register
});

// Metric 1: HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed by HireHub API',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Metric 2: HTTP Request Latency Histogram
const httpRequestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Histogram of HTTP request durations in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

// Metric 3: Application Health Gauge
const appHealthGauge = new client.Gauge({
  name: 'job_portal_app_health',
  help: 'Application operational status (1 = Operational, 0 = Outage)',
  registers: [register]
});
appHealthGauge.set(1);

// Metric 4: Active HTTP Connections Gauge
const activeRequestsGauge = new client.Gauge({
  name: 'job_portal_active_requests',
  help: 'Number of active in-flight HTTP requests',
  registers: [register]
});

// Middleware to record request duration and metrics
const metricsMiddleware = (req, res, next) => {
  if (req.path === '/metrics' || req.path === '/api/metrics') {
    return next();
  }
  activeRequestsGauge.inc();
  const start = process.hrtime();

  res.on('finish', () => {
    activeRequestsGauge.dec();
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    const route = req.baseUrl + (req.route ? req.route.path : req.path);

    httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc();
    httpRequestDurationHistogram.labels(req.method, route, res.statusCode.toString()).observe(durationInSeconds);
  });

  next();
};

// Prometheus scrape endpoint handler
const metricsHandler = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
};

router.get('/metrics', metricsHandler);

module.exports = {
  router,
  metricsMiddleware,
  metricsHandler,
  register
};
