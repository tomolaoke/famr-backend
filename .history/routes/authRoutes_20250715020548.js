// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Spread the signup array to pass middleware and handler
router.post('/signup', ...authController.signup);
router.post('/login', authController.login);

module.exports = router;