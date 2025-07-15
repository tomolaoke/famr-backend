const express = require('express');
const { protect } = require('../middleware/auth');
const { updateProfile } = require('../controllers/profileController');

const router = express.Router();

router.put('/update', protect, updateProfile);  // Protected with JWT

module.exports = router;