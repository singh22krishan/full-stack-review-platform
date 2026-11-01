require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const routes = require('./routes/api');

const app = express();
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({ origin: clientOrigins, credentials: true }));
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err?.message || 'Unhandled request error');
  const status = Number.isInteger(err?.status) ? err.status : 500;
  res.status(status).json({ error: status >= 500 ? 'Server error' : (err.message || 'Request failed') });
});

const port = process.env.PORT || 5000;
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('MONGO_URI and JWT_SECRET must be configured');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API running on ${port}`)))
  .catch((err) => {
    console.error('MongoDB connection failed', err.message);
    process.exit(1);
  });
