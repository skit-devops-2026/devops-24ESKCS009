const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { metricsMiddleware, metricsHandler } = require('./routes/metrics');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Prometheus Metrics Scrape Endpoint
app.get('/metrics', metricsHandler);

// Routes
app.use('/api', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Determine static assets location for unified container deployment
const frontendDir = path.join(__dirname, '../frontend');
const rootDir = path.join(__dirname, '..');
const staticDir = fs.existsSync(path.join(frontendDir, 'index.html')) ? frontendDir : rootDir;

if (fs.existsSync(path.join(staticDir, 'index.html'))) {
  app.use(express.static(staticDir));
}

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to HireHub Job Portal Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    metrics: '/metrics'
  });
});

// Root endpoint: Serves web UI for browser requests or JSON for API clients
app.get('/', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath) && req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.sendFile(indexPath);
  }
  res.json({
    message: 'Welcome to HireHub Job Portal Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    metrics: '/metrics'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HireHub Backend] Server running on port ${PORT} (0.0.0.0:${PORT})`);
});

module.exports = app;

