// server.js
  const express = require('express');
  const connectDB = require('./config/db');
  const cors = require('cors');
  require('dotenv').config();

  const app = express();

  connectDB();

  app.use(cors({ origin: 'https://famr.vercel.app' }));
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });

  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>famr Backend</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f4f9; }
          h1 { color: #2c3e50; }
          p { color: #7f8c8d; }
          a { color: #3498db; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Welcome to the famr webapp project backend</h1>
        <p>Add your contribution via <a href="https://github.com">GitHub</a></p>
      </body>
      </html>
    `);
  });

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/profile', require('./routes/profileRoutes'));
  app.use('/api/listings', require('./routes/listingRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/recommendations', require('./routes/recommendationRoutes'));
  app.use('/api/sync', require('./routes/syncRoutes'));

  app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Server error' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));