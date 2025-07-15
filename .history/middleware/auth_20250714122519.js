// auth.js - Middleware to check if user is logged in via JWT token.

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get token from headers (Bearer <token>)
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
    req.user = decoded;  // Attach user ID to request
    next();  // Proceed to route
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

// Separate for admin (simple check for now; enhance later)
const adminProtect = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {  // Check if it's admin
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { protect, adminProtect };