const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HireHub Job Portal Backend API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HireHub Backend] Server running on port ${PORT} (0.0.0.0:${PORT})`);
});

module.exports = app;
