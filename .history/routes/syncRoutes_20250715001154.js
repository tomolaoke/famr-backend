// routes/syncRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const syncController = require('../controllers/syncController');

router.post('/', authMiddleware, syncController.syncActions);

module.exports = router;