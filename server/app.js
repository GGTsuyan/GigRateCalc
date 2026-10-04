// server/app.js
const express = require('express');
const cors = require('cors');
const ratesRouter = require('./routes/ratesRoutes');
const quotesRouter = require('./routes/quotesRoutes');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/rates', ratesRouter);
  app.use('/api/quotes', quotesRouter);

  // Basic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  });

  return app;
}

module.exports = createApp;
