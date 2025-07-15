// server.js - The heart of your backend server. It sets up Express and connects everything.

const express = require('express');  // Import Express to create the server
const dotenv = require('dotenv');    // For loading secrets from .env
const cors = require('cors');        // Allows frontend to connect
const connectDB = require('./config/db');  // Root-level path

dotenv.config();  // Load secrets from .env

const app = express();  // Create the Express app

// Middleware: These run on every request
app.use(cors({ origin: 'https://famr.vercel.app' }));  // Only allow your Vercel frontend to connect
app.use(express.json());  // Parse JSON bodies from requests (e.g., for sign-up forms)

// Connect to database
connectDB();

// Routes (updated to root paths)
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);

const listingRoutes = require('./routes/listingRoutes');
app.use('/listings', listingRoutes);

const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/recommendations', recommendationRoutes);

// ... (add other routes similarly)

const PORT = process.env.PORT || 5000;  // Use port from .env or default to 5000
const server = app.listen(PORT, () => console.log(`famr Server running on port ${PORT}`));  // Start the server


let activeUsers = 0;  // Simple counter

io.on('connection', async (socket) => {
  activeUsers++;
  const metrics = await getMetrics();
  metrics.activeUsers = activeUsers;
  socket.emit('metrics', metrics);  // Send on connect

  // Emit on events (e.g., when a user signs up, but for now manual refresh)
  socket.on('disconnect', () => {
    activeUsers--;
  });
});

// Route for initial fetch (if not using sockets)

app.get('/admin/metrics', (req, res) => {  // Add adminProtect later
  getMetrics().then(metrics => res.json(metrics));
});

// Socket.io for real-time (we'll expand this later)
const io = require('socket.io')(server, { cors: { origin: 'https://famr.vercel.app' } });

// ... (rest of socket.io code from Step 8 remains the same, e.g., io.on('connection', ...))