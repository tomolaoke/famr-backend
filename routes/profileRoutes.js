// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/', authMiddleware, profileController.getProfile);
router.post('/', authMiddleware, profileController.updateProfile);

module.exports = router;