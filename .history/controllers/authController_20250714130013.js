// authController.js - Handles sign-up, login, etc. Explains user creation and token generation.

const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign-Up: Create user with global fields
const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, pin, country, state, city, currency, phone } = req.body;

  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ firstName, lastName, email, password, pin, country, state, city, currency, phone });
    await user.save();  // Saves with hashed password (from model pre-hook)

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Create JWT token
    res.status(201).json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Sign-up failed', error: err });
  }
};

// Login: Check credentials and return token
const login = async (req, res) => {
  const { email, password, pin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)) || user.pin !== pin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ userId: user._id, token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

// Admin Login: Securely handle admin password using bcryptjs and hashed env variable
const adminLogin = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;
  try {
    if (adminEmail !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminPasswordHash) {
      return res.status(500).json({ message: 'Admin password hash not set in environment' });
    }
    const isMatch = await bcrypt.compare(adminPassword, adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Admin token
    res.json({ adminToken: token });
  } catch (err) {
    res.status(500).json({ message: 'Admin login failed', error: err });
  }
};

module.exports = { signup, login, adminLogin };