// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

router.get('/stats', authMiddleware, adminMiddleware, adminController.getStats);
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.get('/listings', authMiddleware, adminMiddleware, adminController.getListings);

module.exports = router;