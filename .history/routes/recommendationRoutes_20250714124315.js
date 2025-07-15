const express = require('express');
const { protect } = require('../middleware/auth');
const { getRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/', protect, getRecommendations);

module.exports = router;